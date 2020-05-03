const TWENTY_FOUR_HOURS_IN_DAY = 24;

const SIXTY_MINUTES_IN_HOUR = 60;

const SIXTY_SECONDS_IN_MINUTE = 60;

const THOUSAND_MILLISECONDS_IN_SECOND = 1000;

export default class Cookies {
  public static set(name: string, value: string, expiry: number): void {
    const date = new Date();

    const dayInMilliseconds =
      TWENTY_FOUR_HOURS_IN_DAY *
      SIXTY_MINUTES_IN_HOUR *
      SIXTY_SECONDS_IN_MINUTE *
      THOUSAND_MILLISECONDS_IN_SECOND;

    const offset = expiry * dayInMilliseconds;

    date.setTime(date.getTime() + offset);
    const encodedValue = encodeURIComponent(value);
    const cookieString = `${name}=${encodedValue};expires=${date.toUTCString()};path=/`;
    document.cookie = cookieString;
  }

  public static get(cookieString: string, name: string): string {
    const cookies = cookieString.split(/; ?/u);
    for (const cookie of cookies) {
      const parts = cookie.split("=");
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
