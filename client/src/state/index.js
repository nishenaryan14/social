import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action to fetch chats
export const fetchChats = createAsyncThunk(
  "auth/fetchChats",
  async (userId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await fetch(`http://localhost:3001/chats/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async action to fetch messages for a chat
export const fetchMessages = createAsyncThunk(
  "auth/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/chat/${chatId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.messages;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  chats: [],
  selectedChat: null,
  messages: [],
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.chats = [];
      state.selectedChat = null;
      state.messages = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setSelectedChat,
  setMessages,
} = authSlice.actions;

export default authSlice.reducer;
