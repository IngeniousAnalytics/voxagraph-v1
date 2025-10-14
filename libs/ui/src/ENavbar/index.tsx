// libs/ui/src/ENavbar/index.tsx
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  AppShell,
  InputWrapper,
  NavLink,
  ScrollArea,
  Space,
  Tabs,
  TextInput,
  Tooltip,
  Menu,
} from '@mantine/core';
import { IENavbar } from 'src/types';
import { RiSearch2Line } from 'react-icons/ri';
import { FaEllipsisV, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import { NAV_ITEM } from 'src/json/navItems';
import { handleUserActions, setLoader } from 'src/services';
import { ENotify } from '../ENotify';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { BiData } from 'react-icons/bi';
import './index.scss';

export function ENavbar({
  allTemplates,
  fetchAllTemplates,
  fetchTemplateById,
  setShowTemplate,
  setGraphs,
  activeTab,
  setActiveTab,
  I_PERMIT,
  I_CONNECT_WITH,
  handleShowChangeToLiveDB,
  setDashboardId,
}: IENavbar) {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateId, setShowTemplateId] = useState<any>(null);
  const [showTemplateName, setShowTemplateName] = useState<string>('');
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector((state: any) => state.dashboardServices.userInfo);

  const handleToggle = (index: number) => {
    setOpenedIndex((prev) => (prev === index ? null : index));
  };

  const isMatch = (label: string) =>
    label.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery !== '';

  const filteredNavItems = useMemo(
    () =>
      NAV_ITEM.map((menu) => {
        const filteredCharts = menu.charts.filter((submenu) => isMatch(submenu.label));
        return { ...menu, charts: filteredCharts };
      }).filter((menu) => menu.charts.length > 0),
    [searchQuery]
  );

  useEffect(() => {
    activeTab === 'templates' && fetchAllTemplates();
  }, [activeTab]);


  const handleRenamAndDelete = async (
    dashboard_id: number,
    dashboard_name: string,
    type: string
  ) => {
    if (type === 'rename' && showTemplateName === '') {
      ENotify('success', `Template Name Required!`);
      setShowTemplateName(dashboard_name);
      setShowTemplateId(null);
      return;
    }

    dispatch(setLoader(true));
    
    setShowTemplate(false);

    const payload = {
      Action: type === 'rename' ? 'dhbn002' : 'dhbd002',
      Data: {
        dashboard_id,
        dashboard_name: type === 'rename' ? showTemplateName : dashboard_name,
        modified_userid: 2,
      },
    };

    const response = await handleUserActions(payload);
    if (response?.data?.status === 'success') {
      dispatch(setLoader(false));
      fetchAllTemplates();
      setGraphs([]);
      setShowTemplateId(null);
      setShowTemplateName('');
      ENotify('success', `Template Name Updated Successfully!`);
    } else {
      dispatch(setLoader(false));
      ENotify('warning', response?.data.message);
      setShowTemplateName(dashboard_name);
    }
  };

  const handlePublish = (name: string, id: number) => {
    const shareableURL = `${window.location.origin}/#/published?name=${name}&id=${id}&db_id=${I_CONNECT_WITH?.db_id}&user_id=${userInfo?.user_id}`;
    ENotify('success', 'Dashboard published!');
    setTimeout(() => window.open(shareableURL), 500);
  };

  return (
    <Fragment>
      <AppShell.Navbar p="md" className="enavbar" aria-label="Sidebar Navigation">
        {/* Sticky header with tabs */}
        <div className="enavbar__stickyHeader">
          <Tabs variant="pills" value={activeTab} onChange={setActiveTab}>
            <Tabs.List className="enavbar__tabs">
              <Tabs.Tab value="charts" disabled={!I_PERMIT.i_chart}>Charts</Tabs.Tab>
              <Tabs.Tab value="templates">Templates</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        <AppShell.Section grow component={ScrollArea} className="enavbar__scroll">
          <div className="enavbar__inner">
            {activeTab === 'charts' && (
              <>
                <InputWrapper>
                  <TextInput
                    mt="md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    rightSection={<RiSearch2Line size={13} />}
                    placeholder="Search chart"
                    disabled={!I_PERMIT.i_chart}
                  />
                </InputWrapper>

                <Space h={12} />

                {(searchQuery ? filteredNavItems : NAV_ITEM).map((menu, index) => {
                  const isAutoOpen = searchQuery ? true : openedIndex === index;
                  return (
                    <NavLink
                      key={index}
                      className="enavbar__group"
                      label={menu.title}
                      childrenOffset={28}
                      onClick={() => handleToggle(index)}
                      opened={isAutoOpen}
                      disabled={!I_PERMIT.i_chart}
                    >
                      {menu.charts.map((submenu, subIndex) => {
                        const shouldHighlight = isMatch(submenu.label);
                        const dragData = JSON.stringify({
                          graphType: submenu.type,
                          graphId: submenu.id,
                          variant: submenu.variant,
                        });

                        return (
                          <Tooltip key={subIndex} label={submenu.label} withArrow>
                            <NavLink
                              draggable
                              onDragStart={(e) => {
                                if (activeTab === 'charts') {
                                  e.dataTransfer.setData('text/plain', dragData);
                                } else {
                                  e.preventDefault();
                                }
                              }}
                              className={`enavbar__item ${shouldHighlight ? 'is-highlighted' : ''}`}
                              label={submenu.label}
                              leftSection={<submenu.icon />}
                              childrenOffset={28}
                            />
                          </Tooltip>
                        );
                      })}
                    </NavLink>
                  );
                })}
              </>
            )}

            {activeTab === 'templates' && (
              <>
                <Space h={8} />
                {allTemplates?.map((each: any, index: number) => (
                  <Tooltip key={index} label={each?.dashboard_name} withArrow>
                    <div
                      className="enavbar__template"
                      onClick={() => {
                        if (index !== showTemplateId) {
                          fetchTemplateById(each?.dashboard_id, each?.dashboard_name);
                          setDashboardId(each);
                        }
                      }}
                    >
                      {index === showTemplateId ? (
                        <TextInput
                          value={showTemplateName}
                          onChange={(e) => setShowTemplateName(e.target.value)}
                          onBlur={() =>
                            handleRenamAndDelete(each?.dashboard_id, each?.dashboard_name, 'rename')
                          }
                          autoFocus
                        />
                      ) : (
                        each?.dashboard_name
                      )}

                      <Menu
                        shadow="md"
                        width={160}
                        withArrow
                        position="right-start"
                        transitionProps={{ transition: 'fade-up', duration: 150 }}
                      >
                        <Menu.Target>
                          <FaEllipsisV className="enavbar__more" onClick={(e) => e.stopPropagation()} />
                        </Menu.Target>
                        <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                          <Menu.Item
                            leftSection={<FaEdit size={16} />}
                            onClick={() => {
                              setShowTemplateId(index);
                              setShowTemplateName(each?.dashboard_name);
                            }}
                          >
                            Rename
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<FaUpload size={16} />}
                            onClick={() =>
                              handlePublish(
                                each?.dashboard_name.split(' ').join('-').toLowerCase(),
                                each?.dashboard_id
                              )
                            }
                          >
                            Publish
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<BiData size={16} />}
                            onClick={() => {
                              setDashboardId(each);
                              handleShowChangeToLiveDB();
                            }}
                          >
                            Move to database
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<FaTrash size={16} />}
                            onClick={() =>
                              handleRenamAndDelete(each.dashboard_id, each?.dashboard_name, 'delete')
                            }
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  </Tooltip>
                ))}
              </>
            )}
          </div>
        </AppShell.Section>
      </AppShell.Navbar>
    </Fragment>
  );
}

export default ENavbar;
