import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Assignment } from '../../types/assignment';

export type FilterType = 'all' | 'pending' | 'overdue' | 'completed';

interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: FilterType;
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
};

// createAsyncThunk lấy danh sách bài tập từ My-JSON-Server
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async () => {
    const response = await fetch(
      'https://my-json-server.typicode.com/khaphong229/D23CQCC129_LTWNC_TH01/assignments'
    );
    if (!response.ok) {
      throw new Error('Lỗi tải dữ liệu từ máy chủ');
    }
    const data: Assignment[] = await response.json();
    return data;
  }
);

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.items.push(action.payload);
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) {
        task.isCompleted = !task.isCompleted;
      }
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Không thể tải danh sách bài tập';
      });
  },
});

export const { addAssignment, toggleComplete, deleteAssignment, setFilter } =
  assignmentsSlice.actions;

export default assignmentsSlice.reducer;
