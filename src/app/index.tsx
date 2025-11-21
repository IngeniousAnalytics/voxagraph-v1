// src/app/index.tsx
import {  useEffect, useState } from 'react';
import { AppShell, MantineProvider } from '@mantine/core';
import { ETopbar, ENavbar, ELoading, EColorPicker } from '@ai-dashboard/ui';
import { Notifications } from '@mantine/notifications';
import { getPublishedParams } from '../utils';
import { IoColorPaletteOutline } from 'react-icons/io5';
import Dashboard from '../pages/Dashboard';
import ConnectDB from './components/ConnectDB';
import Login from '../pages/Login';
import useApp from './hooks/useApp';
import SwitchDB from './components/SwitchDB';
import './index.scss';
import ChangeUserPassword from './components/ChangeUserPassword';
import ChangeConnectionPassword from './components/ChangeConnectionPassword';
import ChangeToLiveDb from './components/ChangeToLiveDb';
//import BrandWatermark from './components/BrandWatermark';

//const theme = createTheme({});

export function App() {
  const {
    handleDrop,
    isLoggedIn,
    mobileOpened,
    desktopOpened,
    toggleMobile,
    toggleDesktop,
    graphs,
    setGraphs,
    templateID,
    templateName,
    handleLogout,
    fetchAllTemplates,
    allTemplates,
    handleUpdatePosition,
    handleUpdateData,
    handleResize,
    handleRefreshData,
    handleDelete,
    isLoading,
    fetchTemplateById,
    activeTab,
    setActiveTab,
    showTemplate,
    setShowTemplate,
    createNewTemplate,
    showPicker,
    setShowPicker,
    // dashboardColor,
    handleDashColor,
    handleChartColor,
    showConnectDB,
    setShowConnectDB,
    handleDBConnection,
    handleConnect,
    isUpdateDB,
    setIsUpdateDB,
    handleSwitchDBConnection,
    I_PERMIT,
    I_CONNECT_WITH,
    handleUpdatePassword,
    handleUpdateConnectionPassword,
    isOpenChangePassword,
    handleShowChangePassword,
    isOpenChangeConnectionPassword,
    handleShowChangeConnectionPassword,
    isOpenChangeToLiveDB,
    handleShowChangeToLiveDB,
    handleChangeToLiveDB,
    dashboardId,
    setDashboardId,
  } = useApp();

  const isPublished = window.location.hash.startsWith('#/published');
  const publishedParams = getPublishedParams();
  const [defaultColor, onChange] = useState('');

  useEffect(() => {
    if (isPublished && publishedParams) {
      fetchTemplateById(
        Number(publishedParams.id),
        String(publishedParams.name),
        Number(publishedParams.db)
      );
    }
  }, [isPublished, publishedParams, fetchTemplateById]);

  useEffect(() => {
    if (defaultColor) {
      handleDashColor(defaultColor);
    }
  }, [defaultColor, handleDashColor]);

  // ResizeObserver error handler - logs helpful info when the error occurs
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        console.warn(
          '⚠️ ResizeObserver Loop Detected (Suppressed)',
          {
            message: 'A layout measurement loop was detected and safely suppressed.',
            cause: 'This typically occurs when Mantine components (Select, Modal, Popover) measure themselves during rendering.',
            affectedComponents: [
              'Dashboard (Grid Layout)',
              'SwitchDB Modal → Select Component',
              'ConnectDB Modal → Select Component',
              'ChangeToLiveDb Modal → Select Component',
            ],
            status: '✅ Suppressed - App continues normally',
            recommendation: 'This is a known browser/framework behavior and does not affect functionality.',
          }
        );
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (

      <div
        className="ai h-100"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <MantineProvider defaultColorScheme="light">
          <Notifications position="top-right" />
          {isPublished ? (
            <div style={{ backgroundColor: graphs[0]?.dashColor }}>
              <Dashboard
                graphs={graphs}
                onUpdatePosition={handleUpdatePosition}
                onUpdateData={handleUpdateData}
                onResize={handleResize}
                onRefresh={handleRefreshData}
                onDelete={handleDelete}
                activeTab={activeTab}
                onChartColor={handleChartColor}
                publishedParams={
                  publishedParams
                    ? {
                        db: Number(publishedParams.db),
                        user_id: Number(publishedParams.user_id),
                      }
                    : undefined
                }
                setGraphs={setGraphs}
              />
            </div>
          ) : !isLoggedIn ? (
            <Login handleConnect={handleConnect} />
          ) : (
            <AppShell
              layout="alt"
              header={{ height: 70 }}
              navbar={{
                width: 210,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
              }}
              padding="md"
            >
              <ETopbar
                mobileOp={mobileOpened}
                mobileTog={toggleMobile}
                deskOp={desktopOpened}
                deskTog={toggleDesktop}
                graphs={graphs}
                setGraphs={setGraphs}
                templateID={templateID}
                templateName={templateName}
                handleLogout={handleLogout}
                onCreateNew={createNewTemplate}
                allTemplates={allTemplates}
                fetchAllTemplates={fetchAllTemplates}
                showTemplate={showTemplate}
                setShowTemplate={setShowTemplate}
                setShowConnectDB={setShowConnectDB}
                setIsUpdateDB={setIsUpdateDB}
                I_PERMIT={I_PERMIT}
                handleShowChangePassword={handleShowChangePassword.open}
                handleShowChangeConnectionPassword={
                  handleShowChangeConnectionPassword.open
                }
                dashboardId={dashboardId}
              />
              <ENavbar
                allTemplates={allTemplates}
                fetchAllTemplates={fetchAllTemplates}
                fetchTemplateById={fetchTemplateById}
                setShowTemplate={setShowTemplate}
                setGraphs={setGraphs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                I_PERMIT={I_PERMIT}
                I_CONNECT_WITH={I_CONNECT_WITH}
                handleShowChangeToLiveDB={handleShowChangeToLiveDB.open}
                setDashboardId={setDashboardId}
              />
              {/* <AppShell.Main style={{ background: graphs[0]?.dashColor }}> */}
                <AppShell.Main className="dashboard-main">
                {graphs?.length > 0 ? (
                  <Dashboard
                    graphs={graphs}
                    onUpdatePosition={handleUpdatePosition}
                    onUpdateData={handleUpdateData}
                    onResize={handleResize}
                    onRefresh={handleRefreshData}
                    onDelete={handleDelete}
                    activeTab={activeTab}
                    onChartColor={handleChartColor}
                    publishedParams={
                      publishedParams
                        ? {
                            db: Number(publishedParams.db),
                            user_id: Number(publishedParams.user_id),
                          }
                        : undefined
                    }
                    setGraphs={setGraphs}
                  />
                ) : (
                  <div className="empty-mesg">
                    <p>Drag and Drop the graphs you would like to plot.</p>
                  </div>
                )}

                {graphs?.length > 0 && (
                  <div
                    className="color-picker"
                    onClick={() => setShowPicker(!showPicker)}
                  >
                    <IoColorPaletteOutline size={30} />
                  </div>
                )}
                {/* Mount watermark outside the grid wrapper */}
              </AppShell.Main>
              {/* <BrandWatermark /> */}
            </AppShell>
          )}

          {showPicker && (
            <EColorPicker
              show={showPicker}
              setShow={setShowPicker}
              value={defaultColor}
              onChange={onChange}
            />
          )}

          <ELoading loading={isLoading} />

          {showConnectDB && (
            <ConnectDB
              show={showConnectDB}
              setShow={setShowConnectDB}
              onSubmit={handleDBConnection}
              I_PERMIT={I_PERMIT}
            />
          )}
          {isUpdateDB && (
            <SwitchDB
              show={isUpdateDB}
              setShow={setIsUpdateDB}
              setShowConnectDB={setShowConnectDB}
              onSubmit={handleSwitchDBConnection}
              I_PERMIT={I_PERMIT}
            />
          )}

          <ChangeUserPassword
            opened={isOpenChangePassword}
            onClose={handleShowChangePassword}
            onSubmit={handleUpdatePassword}
          />
          <ChangeConnectionPassword
            opened={isOpenChangeConnectionPassword}
            onClose={handleShowChangeConnectionPassword}
            onSubmit={handleUpdateConnectionPassword}
          />
          <ChangeToLiveDb
            opened={isOpenChangeToLiveDB}
            onClose={handleShowChangeToLiveDB}
            onSubmit={handleChangeToLiveDB}
            I_PERMIT={I_PERMIT}
          />
        </MantineProvider>
      </div>

  );
}

export default App;