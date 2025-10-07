//src/permissions/index.ts
import { useAppSelector } from 'src/redux/hooks';

interface IUser {
  userid: number;
  username: string;
}

interface IPermission {
  feature: string;
  permission: string;
}

interface IDBAccess {
  db_id: number;
  name: string;
  default_db: boolean;
}

export const getPermissions = () => {
  const loginUserInfo = localStorage.getItem('userInfo');
  const parsedInfo = loginUserInfo ? JSON.parse(loginUserInfo) : null;
  const dbConnectionList = useAppSelector(
    (state: any) => state.dashboardServices.dbConnectionResp
  );

  const permissions: IPermission[] = parsedInfo?.permissions || [];
  const db_access: IDBAccess[] = parsedInfo?.db_access || [];

  const getActions = (feature: string): boolean => {
    const temp = permissions?.find((p) => p?.feature === feature);
    return temp?.permission === 'edit';
  };

  const getConnection = () => {
    const temp = dbConnectionList?.find((c: any) => c?.default_db === true);
    return temp || null;
  };

  const I_USER: IUser = {
    userid: parsedInfo?.user_id || 0,
    username: parsedInfo?.username || '',
  };

  const I_PERMIT = {
    i_chart: getActions('charts'),
    i_templetes: getActions('templetes'),
    i_question: getActions('question'),
    i_query: getActions('query'),
    i_upload_policy: getActions('upload_policy'),
    i_connect_db: getActions('connect_db'),
    i_change_db: getActions('change_db'),
    i_ask_ai_question: getActions('ask_ai_question'),
    i_save_or_update: getActions('savetemplet'),
    i_chart_title_change: getActions('title_change'),
  };

  const I_CONNECT_WITH = getConnection();
  const I_SHOW_CONNECT: boolean = parsedInfo ? db_access?.length === 0 : false;

  return {
    I_USER,
    I_PERMIT,
    I_CONNECT_WITH,
    I_SHOW_CONNECT,
  };
};
