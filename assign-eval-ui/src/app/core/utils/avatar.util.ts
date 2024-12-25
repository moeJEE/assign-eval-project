// src/app/core/utils/avatar.util.ts

export const AVATAR_URLS: string[] = [
    'https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-1024.png',
    'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
    'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
    'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
    'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png'
  ];
  
  /**
   * Returns a random avatar URL from the predefined list.
   */
  export function getRandomAvatar(): string {
    const randomIndex = Math.floor(Math.random() * AVATAR_URLS.length);
    return AVATAR_URLS[randomIndex];
  }
  