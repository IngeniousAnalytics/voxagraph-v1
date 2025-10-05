import React, { use, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  connectDatabase,
  fetchRefreshedData,
  handleUserActions,
  getDbConnection,
  setLoader,
  updateDatabase,
  updatePassword,
  updateConnectionPassword,
} from 'src/services';
import { IGraph, ITemplates } from 'src/types';
import { getPermissions } from 'src/permissions';
import { ENotify } from '@ai-dashboard/ui';
import { getPublishedParams } from 'src/utils';

const useApp = () => {
  const dispatch = useAppDispatch();
  const { I_SHOW_CONNECT, I_CONNECT_WITH, I_PERMIT } = getPermissions();

  const publishedParams = getPublishedParams();

  const isLoading = useAppSelector(
    (state: any) => state.dashboardServices.isLoading
  );

  const userInfo = useAppSelector(
    (state: any) => state.dashboardServices.userInfo
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('authToken')
  );
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [graphs, setGraphs] = useState<IGraph[]>([]);
  const [templateID, setTemplateID] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [allTemplates, setAllTemplates] = useState<ITemplates[]>([]);
  const [activeTab, setActiveTab] = useState<any>('charts');
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [showConnectDB, setShowConnectDB] = useState<boolean>(false);
  const [isUpdateDB, setIsUpdateDB] = useState<boolean>(false);
  const [isOpenChangePassword, handleShowChangePassword] = useDisclosure(false);
  const [isOpenChangeConnectionPassword, handleShowChangeConnectionPassword] =
    useDisclosure(false);
  const [isOpenChangeToLiveDB, handleShowChangeToLiveDB] = useDisclosure(false);
  const [dashboardId, setDashboardId] = useState<any>({});
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const pay = { Action: 'ext0003', Data: { user_id: userInfo?.user_id } };
    if (isLoggedIn) {
      dispatch(getDbConnection(pay));
      handleConnect();
    } else return;
  }, [isLoggedIn]);

  useEffect(() => {
    fetchAllTemplates();
  }, [I_CONNECT_WITH?.db_id]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      const data = event.dataTransfer.getData('text/plain');
      const { graphType, graphId, variant } = JSON.parse(data);

      if (graphType) {
        setGraphs((prevGraphs) => [
          ...prevGraphs,
          {
            id: graphId,
            code: Date.now(),
            type: graphType,
            chartColor: 'white',
            dashColor: 'white',
            variant: variant,
            x: 0 ,
            y: 0,
            width: 580,
            height: 430,
            data: {
              title: '',
              query: '',
              questions: '',
              plot: [],
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  };

  console.log('graphs', graphs);
  const handleUpdatePosition = (
    code: number,
    newX: number,
    newY: number,
    newH: number,
    newW: number
  ) => {
    setGraphs((prevGraphs) =>
      prevGraphs.map((graph) => {
        return graph.code == code
          ? { ...graph, x: newX, y: newY, h: newH, w: newW }
          : graph;
      })
    );
  };

  const handleResize = (code: number, newWidth: number, newHeight: number) => {
    setGraphs((prevGraphs) =>
      prevGraphs.map((graph) =>
        graph.code == code
          ? { ...graph, width: newWidth, height: newHeight }
          : graph
      )
    );
  };

  const handleUpdateData = (code: number, json: any) => {
    const obj = graphs?.find((each) => each?.code === code);
    setGraphs((prevGraphs) =>
      prevGraphs.map((graph) =>
        graph.code === code
          ? {
              ...graph,
              data: {
                title: json?.title || obj?.data.title,
                query: json?.sql_query,
                questions: json?.questions || obj?.data.questions,
                plot: json?.data,
              },
            }
          : graph
      )
    );
  };

  const handleDelete = (code: number) => {
    setGraphs((prevGraphs) =>
      prevGraphs.filter((graphs) => graphs.code !== code)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('storage'));
    window.location.reload();
  };

  const reset = () => {
    setTemplateID(0);
    setTemplateName('');
  };

  const handleRefreshData = async (
    code: number,
    query: string,
    db_id: number,
    user_id?: number
  ) => {
    dispatch(setLoader(true));
    const payload = {
      query: query,
      max_rows: 10000,
      db_id: I_CONNECT_WITH?.db_id || db_id,
      database_name: '',
      user_id: userInfo?.user_id || user_id,
    };

    try {
      const response = await fetchRefreshedData(payload);
      if (response?.data?.status === 'success') {
        const resData = response?.data?.data;

        setGraphs((prevGraphs) =>
          prevGraphs.map((graph) =>
            graph.code === code
              ? { ...graph, data: { ...graph.data, plot: resData } }
              : graph
          )
        );

        dispatch(setLoader(false));
      } else {
        dispatch(setLoader(false));
      }
    } catch {
      dispatch(setLoader(false));
    }
  };

  const fetchAllTemplates = async () => {
    dispatch(setLoader(true));
    const payload = {
      Action: 'dhb0003',
      Data: {
        dashboard_id: 0,
        created_userid: userInfo?.user_id,
        db_id: I_CONNECT_WITH?.db_id,
        database_name: '',
      },
    };
    try {
      const response = await handleUserActions(payload);
      if (response?.data?.status === 'success') {
        dispatch(setLoader(false));
        setAllTemplates(response?.data?.data);
        reset();
      } else {
        dispatch(setLoader(false));
        setAllTemplates([]);
      }
    } catch (error) {
      dispatch(setLoader(false));
      setAllTemplates([]);
    }
  };

  const fetchTemplateById = async (
    id: number,
    name: string,
    db_id?: number
  ) => {
    dispatch(setLoader(true));
    setTemplateID(id);
    setTemplateName(name);

    const payload = {
      Action: 'tmp003',
      Data: {
        dashboard_id: id,
        created_userid: userInfo?.user_id,
        db_id: I_CONNECT_WITH?.db_id || db_id,
        database_name: '',
      },
    };

    const response = await handleUserActions(payload);
    if (response?.data?.status === 'success') {
      const resData = response?.data?.data;
      const db_id = resData[0]?.db_id;
      const temp = resData.map((each: any) =>
        JSON.parse(each.graph_properties)
      );

      setGraphs(temp);
      dispatch(setLoader(false));
      for (const graph of temp) {
        const code = graph?.code;
        const query = graph?.data?.query;
        await handleRefreshData(
          code,
          query,
          db_id,
          publishedParams?.user_id ? Number(publishedParams.user_id) : undefined
        );
      }
    } else {
      dispatch(setLoader(false));
    }
  };

  const createNewTemplate = () => {
    setGraphs([]);
    setTemplateID(0);
    setTemplateName('');
    setActiveTab('charts');
    setDashboardId({});
  };

  const handleChartColor = (code: number, color: string) => {
    setGraphs((prevGraphs) =>
      prevGraphs.map((graph) =>
        graph.code === code ? { ...graph, chartColor: color } : graph
      )
    );
  };

  const handleDashColor = (color: string) => {
    setGraphs((prevGraphs) =>
      prevGraphs.map((graph) => ({
        ...graph,
        dashColor: color,
      }))
    );
  };

  const handleDBConnection = async (values: any) => {
    dispatch(setLoader(true));
    const payload = {
      name: values?.connection_name,
      db_type: values?.db_type,
      host: values?.host,
      port: Number(values?.port),
      username: values?.db_username,
      password: values?.db_password,
      database_name: values?.db_name,
    };
    const response = await connectDatabase(payload);
    if (response?.data?.success) {
      ENotify('success', response?.data?.message);
      const pay = { Action: 'ext0003', Data: { user_id: userInfo?.user_id } };
      dispatch(getDbConnection(pay));
      setIsUpdateDB(false);
      setShowConnectDB(false);
      dispatch(setLoader(false));
    } else {
      ENotify('warning', response?.data?.message);
      setIsUpdateDB(false);
      setShowConnectDB(false);
      dispatch(setLoader(false));
    }
  };

  const handleSwitchDBConnection = async (values: any) => {
    dispatch(setLoader(true));
    const payload = {
      Action: 'ext0002',
      Data: {
        user_id: userInfo?.user_id,
        db_id: Number(values?.db_type_id),
        modified_by: 1,
      },
    };
    const response = await updateDatabase(payload);
    if (response?.data?.status === 'success') {
      ENotify('success', 'Database connection updated successfully');
      const pay = { Action: 'ext0003', Data: { user_id: userInfo?.user_id } };
      dispatch(getDbConnection(pay));
      setIsUpdateDB(false);
      setShowConnectDB(false);
      dispatch(setLoader(false));
      setGraphs([]);
      fetchAllTemplates();
    } else {
      ENotify('warning', response?.data?.message);
      setIsUpdateDB(false);
      setShowConnectDB(false);
      dispatch(setLoader(false));
    }
  };

  const handleConnect = () => {
    setShowConnectDB(I_SHOW_CONNECT);
  };

  const handleUpdatePassword = async (values: any) => {
    dispatch(setLoader(true));
    const payload = {
      username: userInfo?.user_name,
      old_password: values?.oldPassword,
      new_password: values?.newPassword,
    };
    try {
      const response = await updatePassword(payload);
      if (response?.data?.success) {
        ENotify('success', response?.data?.message);
        dispatch(setLoader(false));
        handleShowChangePassword.close();
      } else {
        ENotify('warning', response?.data?.message);
        dispatch(setLoader(false));
        handleShowChangePassword.close();
      }
    } catch (error) {
      ENotify('warning', 'Something went wrong');
      dispatch(setLoader(false));
      handleShowChangePassword.close();
    }
  };

  const handleUpdateConnectionPassword = async (values: any) => {
    dispatch(setLoader(true));
    const payload = {
      host: values?.host,
      db_user_name: values?.username,
      new_password: values?.password,
    };
    try {
      const response = await updateConnectionPassword(payload);
      if (response?.data?.success) {
        ENotify('success', response?.data?.message);
        handleShowChangeConnectionPassword.close();
        dispatch(setLoader(false));
      } else {
        ENotify('warning', response?.data?.message);
        dispatch(setLoader(false));
        handleShowChangeConnectionPassword.close();
      }
    } catch (error) {
      ENotify('warning', 'Something went wrong');
      dispatch(setLoader(false));
      handleShowChangeConnectionPassword.close();
    }
  };

  const handleChangeToLiveDB = async (values: any,form:any) => {
    dispatch(setLoader(true));
    const payload = {
      Action: 'tdb0002',
      Data: { dashboard_id:dashboardId?.dashboard_id, db_id: values?.db_type_id, user_id: userInfo?.user_id },
    };
    try {
       const response = await handleUserActions(payload);
    if (response?.data?.status === 'success') { 
      ENotify('success', response?.data?.message);
      handleShowChangeToLiveDB.close();
      dispatch(setLoader(false));
      fetchAllTemplates();
      form.reset();
      setDashboardId({});
      setGraphs([])
    } else {
      ENotify('warning', response?.data?.message);
      handleShowChangeToLiveDB.close();
      dispatch(setLoader(false));
      form.reset();
    } 
    } catch (error) {
      ENotify('warning', 'Something went wrong');
      handleShowChangeToLiveDB.close();
      dispatch(setLoader(false)); 
      form.reset();
    }
  
  };
  return {
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
    setDashboardId
  };
};

export default useApp;
