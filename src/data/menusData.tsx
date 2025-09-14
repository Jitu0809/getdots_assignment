export interface MenuItem {
  name: string;
  icon?: string;
  checked: boolean;
  type: string
}

export interface DataItem {
  name: string;
  status: string;
  type: "user" | "file" | string;
  active_status?: "active" | "away" | "inactive" | string;
  sub_type?: "image" | "video" | "folder" | string;
  image?: string;
}

export const menus: MenuItem[] = [
    {
        name: 'Files',
        icon: 'fa-solid fa-paperclip',
        checked: true,
        type: 'file'
    },
    {
        name: 'People',
        icon: 'fa-regular fa-user',
        checked: true,
        type: 'user'
    },
    {
        name: 'Chats',
        icon: 'fa-regular fa-comment',
        checked: false,
        type: 'chat'
    },
    {
        name: 'Lists',
        icon: 'fa-solid fa-bars',
        checked: false,
        type: 'list'
    },
];