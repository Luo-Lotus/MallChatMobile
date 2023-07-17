import { create } from 'zustand';
import { CacheUserItem, UserItem } from '../services/types';
import lodash from 'lodash';
import apis from '../services/apis';

interface IUserStore {
  /**当前在线列表 */
  users: UserItem[];
  /** 用户缓存列表 */
  cachedUsers: CacheUserItem[];
  /** 在线列表翻页游标 */
  pageCursor?: string;
  initUsers: () => void;
  fetchUsersByUserIds: (ids: number[]) => Promise<Record<number, CacheUserItem>>;
  getKeyByIdUser: () => Record<number, CacheUserItem>;
  fetchUsers: () => void;
}

const useUsersStore = create<IUserStore>((set, get) => ({
  users: [],
  cachedUsers: [],
  pageCursor: undefined,
  initUsers: () => {
    get().fetchUsers();
  },
  fetchUsers: async () => {
    const res = await apis
      .getGroupList({ params: { pageSize: 20, cursor: get().pageCursor } })
      .send();
    set((state) => ({
      pageCursor: res.cursor,
      users: state.users.concat(res.list || []),
    }));
    get().fetchUsersByUserIds(res.list.map((_) => _.uid));
  },

  fetchUsersByUserIds: async (userIds: number[]) => {
    const groupedUsers = get().getKeyByIdUser();
    const combineCachedUsers = userIds.map((id) => ({
      lastModifyTime: groupedUsers[id]?.lastModifyTime,
      uid: id,
    }));
    const res = await apis.getUserInfoBatch(combineCachedUsers).send();
    const needRefreshUser = res.filter((user) => user.needRefresh);
    needRefreshUser.forEach((user) => (groupedUsers[user.uid] = user));
    set({
      cachedUsers: Object.values(groupedUsers),
    });
    return groupedUsers;
  },

  getKeyByIdUser: () => lodash.keyBy(get().cachedUsers, 'uid'),
}));

export default useUsersStore;
