//libs/ui/src/ETopbar/index.tsx
import { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Switch,
  Image,
  Badge,
  Box,
  Text,
  Tooltip,
  Divider
} from '@mantine/core';
import './index.scss';
import { IETopbar } from 'src/types';
import { handleUserActions, setLoader } from 'src/services/index';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { FaRegCalendarAlt, FaRegUserCircle } from 'react-icons/fa';
import { RiLockPasswordLine, RiLogoutCircleLine } from 'react-icons/ri';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { ENotify } from '../ENotify';
import { FaAngleRight } from 'react-icons/fa';
import { LuDatabaseZap } from 'react-icons/lu';
import AddTemplate from './components/AddTemplate';
import Logo from './../../../../src/assets/img/logo.svg';
import { getPermissions } from 'src/permissions';
import { FiSave ,FiEdit,FiPlusCircle  } from 'react-icons/fi';

export function ETopbar({
  mobileOp,
  mobileTog,
  deskOp,
  deskTog,
  graphs,
  setGraphs,
  templateID,
  templateName,
  handleLogout,
  onCreateNew,
  allTemplates,
  fetchAllTemplates,
  showTemplate,
  setShowTemplate,
  setShowConnectDB,
  setIsUpdateDB,
  I_PERMIT,
  handleShowChangePassword,
  handleShowChangeConnectionPassword,
  dashboardId,
}: IETopbar) {
  const dispatch = useAppDispatch();
  const { I_CONNECT_WITH } = getPermissions();
  const userInfo = useAppSelector(
    (state: any) => state.dashboardServices.userInfo
  );
  const [currentTime, setCurrentTime] = useState(moment());
  const [darkMode, setDarkMode] = useState(false);

  const toggleColorScheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.setAttribute('data-mantine-color-scheme', 'dark');
    } else {
      htmlElement.setAttribute('data-mantine-color-scheme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  const submitTemplateData = async (values: any) => {
    const isUpdate = !!templateID;
    const { template_name } = values;

    const isDuplicate = allTemplates.some(
      (item: any) =>
        item.dashboard_name?.toLowerCase() === template_name.toLowerCase()
    );

    if (isDuplicate && !isUpdate) {
      ENotify('warning', 'Template name already exists.');
      return;
    }
    dispatch(setLoader(true));
    setShowTemplate(false);

    const payload = {
      Action: isUpdate ? 'dhb0002' : 'dhb0001',
      Data: graphs.map((each) => {
        const graphCopy = { ...each, data: { ...each.data, plot: [] } };
        const baseData = {
          graph_properties: JSON.stringify(graphCopy),
          dashboard_name: template_name,
          graph_name: each.type,
          graph_code: each.code,
          graph_id: each.id,
          title: each.data.title,
          sql_query: each.data.query,
          question: each.data.questions,
          db_id: I_CONNECT_WITH?.db_id,
          database_name: '',
        };
        if (isUpdate) {
          return {
            ...baseData,
            dashboard_id: templateID,
            modified_userid: userInfo?.user_id,
            recordstatus_id: 1,
            db_id: I_CONNECT_WITH?.db_id,
            database_name: '',
          };
        } else {
          return {
            ...baseData,
            created_userid: userInfo?.user_id,
            db_id: I_CONNECT_WITH?.db_id,
            database_name: '',
          };
        }
      }),
    };

    const response = await handleUserActions(payload);
    if (response?.data?.status === 'success') {
      dispatch(setLoader(false));
      if (!isUpdate) setGraphs([]);
      ENotify(
        'success',
        `Template ${isUpdate ? 'updated' : 'saved'} successfully.`
      );
    } else {
      dispatch(setLoader(false));
      ENotify('warning', 'Something went wrong please try again.');
    }
  };

  const handleInsertUpdate = () => {
    !!templateID
      ? submitTemplateData({ template_name: templateName })
      : setShowTemplate(true);
  };

  const hasAllPlots = graphs.every(
    (item) =>
      item.type === "text" ||
      (Array.isArray(item.data.plot) && item.data.plot.length > 0)
  );

  const capitalizeWords = (str = '') => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Fragment>
      <AppShell.Header className="etopbar">
        <Group h="100%" px="md" justify="space-between" className="etopbar__inner">
          {/* Left: nav + logo */}
          <div className="etopbar__left">
            <div className="etopbar__toggle">
              <Burger
                aria-label="Toggle mobile sidebar"
                opened={mobileOp}
                onClick={mobileTog}
                hiddenFrom="sm"
                size="sm"
              />
              <Group gap="xs" visibleFrom="sm">
                {deskOp && (
                  <Burger
                    aria-label="Toggle desktop sidebar"
                    opened={!deskOp}
                    onClick={deskTog}
                    size="sm"
                  />
                )}
                {!deskOp && (
                  <button className="ghost-icon-btn" aria-label="Open sidebar" onClick={deskTog}>
                    <FaAngleRight size={20} />
                  </button>
                )}
              </Group>
            </div>

            <div className="etopbar__brand">
              <Image src={Logo} h={40} w="auto" alt="Logo" />
              <Badge color="yellow" size="xs" variant="outline" className="etopbar__beta">Beta</Badge>
            </div>
          </div>

          {/* Center: title */}
          <div className="etopbar__title">
            <Text component="h2" className="etopbar__titleText" title={dashboardId?.dashboard_name}>
              {dashboardId?.dashboard_name}
            </Text>
          </div>

          {/* Right actions */}
          <div className="etopbar__right">
            { I_PERMIT.i_save_or_update ? (
              <Group gap="xs" className="etopbar__cta">
                <Tooltip label={templateID ? "Update Dashboard" : "Save Dashboard"} withArrow>
                  <Button
                    aria-label={templateID ? "Update Dashboard" : "Save Dashboard"}
                    className="primary-cta"
                    color={templateID ? "blue" : "green"}
                    onClick={handleInsertUpdate}
                  >
                    {templateID ? <FiEdit size={18}/> : <FiSave size={18}/>}
                  </Button>
                </Tooltip>

                {templateID && (
                  <Tooltip label="Create New Dashboard" withArrow>
                    <Button
                      aria-label="Create New Dashboard"
                      color="gray"
                      variant="light"
                      onClick={onCreateNew}
                      disabled={!hasAllPlots}
                    >
                      <FiPlusCircle size={18}/>
                    </Button>
                  </Tooltip>
                )}
              </Group>
            ) : null}

            <Divider orientation="vertical" className="etopbar__divider" />

            <div className="etopbar__dbinfo" title={getPermissions()?.I_CONNECT_WITH?.name}>
              <span className="etopbar__dbpill">{I_CONNECT_WITH?.name}</span>
            </div>

            <Menu
              shadow="md"
              width={260}
              withArrow
              position="bottom-end"
              transitionProps={{ transition: 'fade', duration: 120 }}
            >
              <Menu.Target>
                <button className="etopbar__profile" aria-label="Open profile menu">
                  <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
                    alt="User avatar"
                    size={36}
                    radius="xl"
                  />
                  <Text className="etopbar__username">{capitalizeWords(userInfo?.username)}</Text>
                </button>
              </Menu.Target>

              <Menu.Dropdown className="etopbar__menu">
                <Menu.Item leftSection={<FaRegUserCircle size={16} />}>My Profile</Menu.Item>
                <Menu.Item leftSection={<RiLockPasswordLine size={16} />} onClick={handleShowChangePassword}>
                  Change Password
                </Menu.Item>
                <Menu.Item leftSection={<RiLockPasswordLine size={16} />} onClick={handleShowChangeConnectionPassword}>
                  Connect Updated Database Password
                </Menu.Item>
                <Menu.Item leftSection={<LuDatabaseZap size={16} />} onClick={() => setIsUpdateDB(true)}>
                  Switch Database
                </Menu.Item>
                <Menu.Item onClick={handleLogout} leftSection={<RiLogoutCircleLine size={16} />}>
                  Logout
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label className="etopbar__themeLabel">
                  <div className="themeToggle">
                    <small>Light</small>
                    <Switch
                      color={darkMode ? 'dark.4' : 'gray.3'}
                      size="md"
                      onLabel={<CiLight size={16} />}
                      offLabel={<MdDarkMode size={16} />}
                      checked={darkMode}
                      onChange={toggleColorScheme}
                    />
                    <small>Dark</small>
                  </div>
                </Menu.Label>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Group>
      </AppShell.Header>

      {showTemplate && (
        <AddTemplate
          show={showTemplate}
          setShow={setShowTemplate}
          allTemplates={allTemplates}
          onSubmit={submitTemplateData}
        />
      )}
    </Fragment>
  );
}

export default ETopbar;
