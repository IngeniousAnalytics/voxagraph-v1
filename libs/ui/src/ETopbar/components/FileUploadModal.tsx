import { useMemo, useState, useEffect } from "react";
import {
  Modal, Button, Group, Text, Stack, Paper, Progress, Alert, FileInput, ThemeIcon, rem, Divider
} from "@mantine/core";
import { IconUpload, IconAlertCircle, IconFileSpreadsheet, IconBraces } from "@tabler/icons-react";
import { ENotify } from "../../ENotify";
import { useAppDispatch } from "src/redux/hooks";
import {
  uploadUserDataFile,
  getUserFileStatus,
  deleteUserDataFile,
  type FileStatus,
} from "src/services";

type Props = { opened: boolean; onClose: () => void };

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPT = ".csv,.xls,.json";
const ALLOWED_EXTS = [".csv", ".xls", ".json"];

function prettyBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUploadModal({ opened, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  const [status, setStatus] = useState<FileStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load status whenever modal opens
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!opened) return;
      setLoadingStatus(true);
      setError(null);
      try {
        const s = await getUserFileStatus();
        if (active) setStatus(s);
      } catch (e: any) {
        if (active) setError(e?.response?.data?.detail || "Failed to load file status.");
      } finally {
        if (active) setLoadingStatus(false);
      }
    };
    load();
    return () => { active = false; };
  }, [opened]);

  const icon = useMemo(() => {
    if (!file) return <IconUpload size={28} />;
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (ext === ".json") return <IconBraces size={28} />;
    if (ext === ".csv" || ext === ".xls") return <IconFileSpreadsheet size={28} />;
    return <IconUpload size={28} />;
  }, [file]);

  const reset = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    setUploading(false);
  };

  const validate = (f: File) => {
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
    if (!ALLOWED_EXTS.includes(ext)) {
      throw new Error("Only .csv, .xls or .json files are allowed.");
    }
    if (f.size > MAX_BYTES) {
      throw new Error(`File size must be ≤ 2 MB (got ${prettyBytes(f.size)}).`);
    }
  };

  const onFileChange = (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    try {
      validate(f);
      setFile(f);
    } catch (e: any) {
      setFile(null);
      setError(e?.message ?? "Invalid file.");
    }
  };

  const refreshStatus = async () => {
    try {
      const s = await getUserFileStatus();
      setStatus(s);
    } catch {
      /* ignore for now */
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setUploading(true);
    setProgress(5);

    const tryOnce = async (replace: boolean) => {
      await uploadUserDataFile(file, (pct: number) => setProgress(Math.min(95, pct)), replace);
    };

    try {
      await tryOnce(false);
      setProgress(100);
      ENotify("success", "File uploaded successfully.");
      await refreshStatus();
      setTimeout(() => { reset(); /* keep modal open to show status if you prefer */ }, 350);
    } catch (e: any) {
      // If server says file exists and suggests ?replace=true, ask the user
      const detail: string = e?.response?.data?.detail || "";
      const suggestsReplace = /replace=true/i.test(detail);

      if (suggestsReplace) {
        const ok = window.confirm(
          `${detail}\n\nDo you want to overwrite the existing file?`
        );
        if (ok) {
          try {
            setProgress(5);
            await tryOnce(true);
            setProgress(100);
            ENotify("success", "File replaced successfully.");
            await refreshStatus();
            setTimeout(() => { reset(); /* keep modal open to show status */ }, 350);
            return;
          } catch (e2: any) {
            const msg2 = e2?.response?.data?.detail || e2?.message || "Replace failed.";
            setError(msg2);
            ENotify("warning", msg2);
          } finally {
            setUploading(false);
          }
        } else {
          setUploading(false);
          setError("Upload cancelled. Existing file was not overwritten.");
        }
      } else {
        setUploading(false);
        setProgress(0);
        const msg = detail || e?.message || "Upload failed. Please try again.";
        setError(msg);
        ENotify("warning", msg);
      }
    }
  };

  const handleDelete = async () => {
    if (!status?.has_file) return;
    const ok = window.confirm(`Delete '${status.file_name}' permanently?`);
    if (!ok) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteUserDataFile();
      ENotify("success", "File deleted.");
      await refreshStatus();
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Delete failed.";
      setError(msg);
      ENotify("warning", msg);
    } finally {
      setDeleting(false);
    }
  };

  const disabled = !file || uploading;

  return (
    <Modal
      opened={opened}
      onClose={() => { reset(); onClose(); }}
      title="Upload data file"
      size="lg"
      radius="lg"
      overlayProps={{ opacity: 0.2, blur: 2 }}
    >
      <Stack gap="md">
        {/* Existing file status */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={600}>Current file</Text>
              {loadingStatus ? (
                <Text size="sm" c="dimmed">Loading…</Text>
              ) : status?.has_file ? (
                <>
                  <Text size="sm">
                    <b>Name:</b> {status.file_name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Size: {status.size_bytes != null ? prettyBytes(status.size_bytes) : "—"}
                    {status.updated_at ? ` · Updated: ${status.updated_at}` : ""}
                  </Text>
                </>
              ) : (
                <Text size="sm" c="dimmed">No file uploaded yet.</Text>
              )}
            </div>

            <Group gap="xs">
              <Button variant="default" onClick={refreshStatus} loading={loadingStatus}>
                Refresh
              </Button>
              <Button
                color="red"
                variant="light"
                onClick={handleDelete}
                disabled={!status?.has_file}
                loading={deleting}
              >
                Delete
              </Button>
            </Group>
          </Group>
        </Paper>

        <Divider />

        {/* Upload area */}
        <Group justify="center">
          <ThemeIcon variant="light" size={48} radius="xl">
            {file ? (file.name.toLowerCase().endsWith('.json') ? <IconBraces size={28}/> : <IconFileSpreadsheet size={28}/>) : <IconUpload size={28} />}
          </ThemeIcon>
        </Group>
        <Text ta="center" fw={600}>Choose your file</Text>
        <Text ta="center" c="dimmed" size="sm">
          Accepted: <b>.csv</b>, <b>.xls</b>, <b>.json</b> · Max size: <b>2 MB</b>
        </Text>

        <FileInput
          placeholder="Select .csv, .xls, or .json"
          value={file}
          onChange={onFileChange}
          accept={ACCEPT}
          disabled={uploading}
          clearable
          withAsterisk
        />

        {file && (
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={600}>{file.name}</Text>
                <Text size="sm" c="dimmed">{prettyBytes(file.size)}</Text>
              </div>
              <Button variant="subtle" color="gray" onClick={() => setFile(null)} disabled={uploading}>
                Remove
              </Button>
            </Group>

            {uploading && (
              <div style={{ marginTop: rem(12) }}>
                <Progress value={progress} />
              </div>
            )}
          </Paper>
        )}

        {error && (
          <Alert color="red" icon={<IconAlertCircle size={18} />} variant="light" title="Error">
            {error}
          </Alert>
        )}

        <Group justify="right" mt="xs">
          <Button variant="default" onClick={() => { reset(); onClose(); }} disabled={uploading}>
            Close
          </Button>
          <Button onClick={handleUpload} disabled={disabled}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
