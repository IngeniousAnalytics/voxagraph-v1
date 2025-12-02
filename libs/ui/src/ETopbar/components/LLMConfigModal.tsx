import { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Button, Group, Text } from '@mantine/core';
import { dashApiInstance } from 'src/services/instance';
import { ENotify } from '../../ENotify';

interface LLMConfigModalProps {
  opened: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'ollama', label: 'Ollama' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'grok', label: 'Grok' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'claude', label: 'Claude' },
];

export default function LLMConfigModal({ opened, onClose }: LLMConfigModalProps) {
  const [provider, setProvider] = useState<string>('gemini');
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Prefill sensible defaults per provider
    if (provider === 'gemini') {
      setModelName('gemini-2.5-flash');
      setBaseUrl('');
    } else if (provider === 'openai') {
      setModelName('gpt-4');
      setBaseUrl('');
    } else if (provider === 'ollama') {
      setModelName('llama3');
      setBaseUrl((prev) => prev || 'http://localhost:11434');
    } else if (provider === 'grok') {
      setModelName('grok-3');
      setBaseUrl('');
    } else if (provider === 'deepseek') {
      setModelName('deepseek-chat');
      setBaseUrl((prev) => prev || 'https://api.deepseek.com');
    } else if (provider === 'claude') {
      setModelName('claude-3-5-sonnet-latest');
      setBaseUrl('');
    }
  }, [provider]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: any = {
        provider,
        model_name: modelName,
      };
      if (apiKey) payload.api_key = apiKey;
      if (baseUrl) payload.base_url = baseUrl;
      const res = await dashApiInstance.post('/api/llm/llm-config', payload, {
        headers: { accept: 'application/json' },
      });
      const data = res.data;
      ENotify('success', data?.message || 'LLM configuration updated successfully.');
      onClose();
    } catch (e: any) {
      ENotify('warning', e?.message || 'Failed to update LLM configuration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={<Text>LLM Configuration</Text>} centered>
      <Select label="Provider" data={PROVIDERS} value={provider} onChange={(v) => v && setProvider(v)} required />
      <TextInput mt="sm" label="Model Name" value={modelName} onChange={(e) => setModelName(e.currentTarget.value)} required />
      {(provider === 'gemini' || provider === 'openai' || provider === 'grok' || provider === 'deepseek' || provider === 'claude') && (
        <TextInput mt="sm" label="API Key" value={apiKey} onChange={(e) => setApiKey(e.currentTarget.value)} placeholder="your-api-key" />
      )}
      {(provider === 'ollama' || provider === 'deepseek') && (
        <TextInput mt="sm" label="Base URL" value={baseUrl} onChange={(e) => setBaseUrl(e.currentTarget.value)} placeholder={provider === 'deepseek' ? 'https://api.deepseek.com' : 'http://localhost:11434'} />
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button loading={submitting} onClick={handleSubmit}>Save</Button>
      </Group>
    </Modal>
  );
}
