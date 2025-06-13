import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";
import { menuIconList } from "../../components/App/SideBarv2/index";

export const name = "sidebar";
export const resetState = createAction(`${name}/RESET_STATE`);

export type ChildrenPageMenuItem = {
  name: string | any;
  storeName: string | any;
  path: string | any;
};

type IconKey = keyof typeof menuIconList;

export type PageMenuItem = {
  name: string | any;
  storeName: string | any;
  path: string | any;
  icon: IconKey;
  isOpen: boolean;
  childrenPages: ChildrenPageMenuItem[] | null;
};

const mainMenuItemList: PageMenuItem[] = [
  {
    name: "Dashboard",
    storeName: "dashboard",
    path: "/admin/dashboard",
    icon: "settingsIcon",
    isOpen: false,
    childrenPages: null,
  },
  {
    name: "User",
    storeName: "user",
    path: "/admin/user",
    icon: "manageAccountsIcon",
    isOpen: false,
    childrenPages: [
      {
        name: "All User",
        storeName: "user",
        path: "/admin/user",
      },
      // {
      //   name: "Edit User",
      //   storeName: "user",
      //   path: "/admin/user/edit",
      // },
    ],
  },
  // {
  //   name: "Post",
  //   storeName: "post",
  //   path: "/admin/post",
  //   icon: "feedIcon",
  //   isOpen: false,
  //   childrenPages: [
  //     {
  //       name: "All Post",
  //       storeName: "user",
  //       path: "/admin/post",
  //     },
  //     {
  //       name: "Edit post",
  //       storeName: "post",
  //       path: "/admin/post/edit",
  //     },
  //   ],
  // },
  {
    name: "Resource",
    storeName: "resource",
    path: "/admin/file",
    icon: "attachFileIcon",
    isOpen: false,
    childrenPages: [
      {
        name: "All Resource",
        storeName: "resource",
        path: "/admin/file",
      },
    ],
  },
];

const bottomMenuItem: PageMenuItem[] = [
  {
    name: "Profile",
    storeName: null,
    path: "/profile",
    icon: "person2Icon",
    isOpen: false,
    childrenPages: null,
  },
  {
    name: "Logout",
    storeName: null,
    path: null,
    icon: "exitToAppIcon",
    isOpen: false,
    childrenPages: null,
  },
];

export type NavbarType = {
  selectedItem: PageMenuItem | ChildrenPageMenuItem;
  mainMenuItemList: PageMenuItem[];
  bottomMenuItemList: PageMenuItem[];
};

export const initialState: NavbarType = {
  selectedItem: { name: null, storeName: null, path: null },
  mainMenuItemList: mainMenuItemList,
  bottomMenuItemList: bottomMenuItem,
};

const narbarSlice = createSlice({
  name,
  initialState,
  reducers: {
    toggleMenuItem(state, { payload }: PayloadAction<string>) {
      const index = state.mainMenuItemList.findIndex(
        (item) => item.name === payload
      );

      if (index !== -1) {
        state.mainMenuItemList[index].isOpen =
          !state.mainMenuItemList[index].isOpen;
      }
    },

    setSelectedItem(
      state,
      { payload }: PayloadAction<PageMenuItem | ChildrenPageMenuItem>
    ) {
      state.selectedItem = payload;
    },

    setSelectedMenuItemByPathName(state, { payload }: PayloadAction<string>) {
      const arrayConcat: PageMenuItem[] = state.mainMenuItemList.concat(
        state.bottomMenuItemList
      );
      for (let menuItem of arrayConcat) {
        //menuItem hasn't got childrenPage
        if (!menuItem.childrenPages) {
          if (menuItem.path && menuItem.path.indexOf(payload) >= 0) {
            state.selectedItem = menuItem;
            return;
          }
        } else {
          // menuItem has got childrenPage
          for (let childMenuItem of menuItem.childrenPages) {
            if (
              childMenuItem.path &&
              childMenuItem.path.indexOf(payload) >= 0
            ) {
              state.selectedItem = childMenuItem;
              return;
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const firstFetch = createAction(`${name}/firstFetch`);

// Selectors
export const selectState = (state: RootReducerType) => state[name];
export const getSelectedMenuItem = createSelector(
  selectState,
  (state) => state.selectedItem
);
export const selectMainMenuItemList = createSelector(
  selectState,
  (state) => state.mainMenuItemList
);

export const selectBottomMenuItemList = createSelector(
  selectState,
  (state) => state.bottomMenuItemList
);

export const { actions } = narbarSlice;

export default narbarSlice;
