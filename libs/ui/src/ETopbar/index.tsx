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
  Anchor,
  Tooltip
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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(moment());
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

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
      <AppShell.Header
        style={{ backgroundColor: '#757b81ff' }}
        className="header"
      >
        <Group h="100%" px="md" justify="space-between">
          <div className="header-menus">
            <div className="header-menus--toggle">
              <Burger
                opened={mobileOp}
                onClick={mobileTog}
                hiddenFrom="sm"
                size="sm"
              />
              <Group>
                {deskOp && (
                  <Burger
                    opened={!deskOp}
                    onClick={deskTog}
                    visibleFrom="sm"
                    size="sm"
                  />
                )}
                {!deskOp && (
                  <FaAngleRight size={24} color="white" onClick={deskTog} />
                )}
              </Group>
            </div>
            <div className="header-menus--logo">
              <Image src={Logo} h={50} w={150} />
              <Box component="div">
                {' '}
                <sup>
                  <Badge
                    color="yellow"
                    size="xs"
                    variant="outline"
                    className="fw-normal text-capitalize"
                  >
                    Beta
                  </Badge>
                </sup>
              </Box>
            </div>
          </div>
          <h2 style={{color:"white",fontSize:15,fontWeight:700}}>{dashboardId?.dashboard_name}</h2>
          <div className="header-actions">
            { I_PERMIT.i_save_or_update ? (
              <Group>
                <Button color="green" onClick={handleInsertUpdate}>
                  {templateID ?
                   <Tooltip label="Update Dashboard" withArrow>
                  <FiEdit  size={20}/>
                  </Tooltip> :  <Tooltip label="Save Dashboard" withArrow><FiSave size={20} /></Tooltip>}
                </Button>

                {templateID && (
                  <Tooltip label="Create New Dashboard" withArrow>
                  <Button
                    color="gray"
                    onClick={onCreateNew}
                    disabled={!hasAllPlots}
                  >
                    
                   <FiPlusCircle size={20}/>
                
                  </Button>
                     </Tooltip>
                )}
              </Group>
            ) : (
              <></>
            )}
            <div className="header-actions--dbinfo">
              <p className="header-actions--dbinfo--db--text">
                {I_CONNECT_WITH?.name}
              </p>
            </div>
            <div className="header-actions--profile">
              <Menu
                shadow="md"
                width={250}
                withArrow
                position="bottom-end"
                transitionProps={{ transition: 'fade-up', duration: 150 }}
              >
                <Menu.Target>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
                      alt="it's me"
                      size={45}
                    />
                    <Text style={{ color: 'white' }}>
                      {capitalizeWords(userInfo?.username)}
                    </Text>
                  </div>
                </Menu.Target>

                <Menu.Dropdown className="header-actions--notify-dd">
                  <Menu.Item leftSection={<FaRegUserCircle size={16} />}>
                    My Profile
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<RiLockPasswordLine size={16} />}
                    onClick={handleShowChangePassword}
                  >
                    Change Password
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<RiLockPasswordLine size={16} />}
                    onClick={handleShowChangeConnectionPassword}
                  >
                    Connect Updated Database Password
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<LuDatabaseZap size={16} />}
                    onClick={() => setIsUpdateDB(true)}
                  >
                    Switch Database
                  </Menu.Item>

                  <Menu.Item
                    onClick={handleLogout}
                    leftSection={<RiLogoutCircleLine size={16} />}
                  >
                    Logout
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Label style={{ textAlign: 'center' }}>
                    <div className="th-color">
                      <div className="th-color--modes">
                        <small>Light</small>
                        <Switch
                          color={darkMode ? 'dark.4' : 'light.4'}
                          size="md"
                          onLabel={
                            <CiLight size={16} color="var(--bs-warning)" />
                          }
                          offLabel={
                            <MdDarkMode
                              size={16}
                              color="var(--bs-link-color)"
                            />
                          }
                          checked={darkMode}
                          onChange={toggleColorScheme}
                        />
                        <small>Dark</small>
                      </div>
                      <div className="th-color--themes"></div>
                    </div>
                  </Menu.Label>
                </Menu.Dropdown>
              </Menu>
            </div>
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
