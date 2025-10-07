// index.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashApiInstance } from './instance';

const savedUserInfo = localStorage.getItem('userInfo');

const initialState: any = {
  userInfo: savedUserInfo ? JSON.parse(savedUserInfo) : null,
  quesResponse: [],
  dbConnectionResp: [],
  sqlResponse: [],
  isLoading: false,
};

export const userLogin = createAsyncThunk(
  'dashboardAPI/userLogin',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await dashApiInstance.post(`/admin/login/`, payload);
      
      const { access_token, user_id, username, roles, permissions, db_access } =
        response.data;

      const payl = { Action: 'ext0003', Data: { user_id: user_id } };
      dispatch(getDbConnection(payl));
      
      localStorage.setItem('authToken', access_token);

      const userInfo = { user_id, username, roles, permissions, db_access };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 0);

      return userInfo;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const connectDatabase = async (payload: any) => {
  return dashApiInstance.post(`/db/add-db/`, payload);
};

export const updateDatabase = async (payload: any) => {
  return dashApiInstance.post(`/masterapi/execute`, payload);
};

export const updatePassword = async (payload: any) => {
  return dashApiInstance.post(`/admin/update-password/`, payload);
};

export const updateConnectionPassword = async (payload: any) => {
  return dashApiInstance.put(`/updatecredentials_DB/update-credentials/`, payload);
};

export const getDbConnection = createAsyncThunk(
  'dashboardAPI/getDbConnection',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await dashApiInstance.post(
        `/masterapi/execute`,
        payload
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Get Db Connection Failed');
    }
  }
);

export const fetchAskedQuestionResponse = createAsyncThunk(
  'dashboardAPI/fetchAskedQuestionResponse',
  async (payload: any) => {
    const newPayload = {
      question: payload.question,
    };
    const response = await dashApiInstance.post(
      `/ask?db_id=${payload.db_id}`,
      newPayload
    );
    return response.data;
  }
);

export const fetchExecutedSQLResponse = createAsyncThunk(
  'dashboardAPI/fetchExecutedSQLResponse',
  async (payload: any) => {
    const response = await dashApiInstance.post(`/sql/execute-sql`, payload);
    return response.data;
  }
);

export const handleUserActions = async (payload: any) => {
  return dashApiInstance.post(`masterapi/execute`, payload);
};

export const fetchRefreshedData = async (payload: any) => {
  return dashApiInstance.post(`/execute-sql`, payload);
};

export const AIDashboardSlice = createSlice({
  name: 'dashboardAPI',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.dbConnectionResp = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(userLogin.rejected, (state) => {
        state.userInfo = null;
      });
    builder.addCase(fetchAskedQuestionResponse.fulfilled, (state, action) => {
      state.quesResponse = action.payload;
    });
    builder.addCase(fetchExecutedSQLResponse.fulfilled, (state, action) => {
      state.sqlResponse = action.payload;
    });
    builder.addCase(getDbConnection.fulfilled, (state, action) => {
      state.dbConnectionResp = action.payload;
    });
  },
});

export const { setLoader, logout } = AIDashboardSlice.actions;
export default AIDashboardSlice.reducer;
