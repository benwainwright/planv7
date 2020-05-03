export class Cookies {
  public static set(name: string, value: string, expiry: number): void {
    const date = new Date();
    const offset = expiry * 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() + offset);
    value = encodeURIComponent(value);
    const cookieString = `${name}=${value};expires=${date.toUTCString()};path=/`;
    document.cookie = cookieString;
  }

  public static get(cookieString: string, name: string): string {
    const cookies = cookieString.split(/; ?/);
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split("=");
      if (parts.length > 1 && parts[0] === name) {
        return decodeURIComponent(parts[1]);
      }
    }
    return "";
  }

  public static delete(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}
