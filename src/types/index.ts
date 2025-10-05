import { IconType } from 'react-icons';

export interface INavItems {
  id: number;
  title: string;
  charts: IChartType[];
}

export interface IChartType {
  id: number;
  type: string;
  label: string;
  icon: IconType;
  variant?: string;
  stacking?: string;
  innerSize?: string;
  step?: string;
  areaStyle?: any;
  symbolSize?: number[];
  radius?: string[];
  roseType?: string;
  angular?: boolean;
}

export interface IENavbar {
  allTemplates: ITemplates[];
  fetchAllTemplates: () => void;
  fetchTemplateById: (id: number, name: string) => void;
  setShowTemplate: any;
  setGraphs: (graphs: IGraph[]) => void;
  activeTab: any;
  setActiveTab?: (activeTab: any) => void;
  I_PERMIT: {
    i_chart: boolean;
  };
  I_CONNECT_WITH: any;
  handleShowChangeToLiveDB: () => void;
  setDashboardId: (id: any) => void;
}

export interface IETopbar {
  mobileOp: boolean;
  mobileTog: () => void;
  deskOp: boolean;
  deskTog: () => void;
  graphs: IGraph[];
  setGraphs: (graphs: IGraph[]) => void;
  templateID: number;
  templateName: string;
  handleLogout: () => void;
  onCreateNew: () => void;
  allTemplates: ITemplates[];
  fetchAllTemplates: () => void;
  showTemplate: boolean;
  setShowTemplate: (x: boolean) => void;
  setShowConnectDB: (x: boolean) => void;
  setIsUpdateDB: (x: boolean) => void;
  I_PERMIT: {
    i_save_or_update: boolean;
  };
   handleShowChangePassword: () => void;
  handleShowChangeConnectionPassword: () => void;
  dashboardId:any
}

export interface IGraph {
  id: number;
  code: number;
  type: string;
  chartColor: string;
  dashColor: string;
  variant: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: {
    title: '';
    query: '';
    questions: '';
    plot: any;
  };
}

export interface IDashboard {
  graphs: IGraph[];
  onUpdatePosition: (code: number, newX: number, newY: number,newH: number,
    newW: number) => void;
  onUpdateData: (
    code: number,
    json: {
      title: string;
      query: string;
      questions: string;
      plot: any;
    }
  ) => void;
  onResize: (code: number, newWidth: number, newHeight: number) => void;
  onRefresh: (code: number, query: string,db_id:number,user_id:number) => void;
  onDelete: (code: number) => void;
  activeTab: string;
  onChartColor: (code: number, color: string) => void;
  publishedParams?: {
    db: number;
    user_id: number;
}
setGraphs: (graphs: IGraph[]) => void;
}

export interface IChartWidget {
  type: string;
  variant: string;
  width: number;
  height: number;
  inputData: any;
  code: number;
  setGraphs: (graphs: IGraph[]) => void;
  isChartTitleChange: boolean;
}

export interface IDraggableChart {
  code: number;
  title?: string;
  type: string;
  chartColor: string;
  variant: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
  onUpdatePosition: (id: number, newX: number, newY: number,newH: number,
    newW: number) => void;
  onUpdateData: (
    code: number,
    json: {
      title: string;
      query: string;
      questions: string;
      plot: any;
    }
  ) => void;
  onResize: (id: number, newWidth: number, newHeight: number) => void;
  onRefresh: (code: number, query: string,db_id:number,user_id:number) => void;
  onDelete: (id: number) => void;
  activeTab: string;
  onChartColor: (code: number, color: string) => void;
  publishedParams?: {
    db: number;
    user_id: number;
  };
  setGraphs: (graphs: IGraph[]) => void;
  setChartCode:(chartCode:any)=>void;
  setTextTilteData:(textTilteData:any)=>void
  setIsEditing:any
  isEditing:any
  charCode:any
}

export interface IAuthMenuItem {
  canread: boolean;
  menuname: string;
  icons?: string;
}

export interface IAddQuery {
  show: boolean;
  setShow: (x: boolean) => void;
  jsonArray: any;
  onSubmit: (values: any) => void;
  I_PERMIT: any;
}

export interface ISearchQuestion {
  show: boolean;
  setShow: (x: boolean) => void;
  onSubmit: (values: any) => void;
  jsonArray: any;
  I_PERMIT: any;
}

export interface ITemplates {
  dashboard_id: number;
  dashboard_name: string;
}

export interface IConnectDB {
  show: boolean;
  setShow: (x: boolean) => void;
  onSubmit: (x: any) => void;
  setShowConnectDB?: (x: boolean) => void;
  I_PERMIT: {
    i_connect_db: boolean;
    i_change_db: boolean;
  };
}

export interface ILogin {
  handleConnect: () => void;
}
