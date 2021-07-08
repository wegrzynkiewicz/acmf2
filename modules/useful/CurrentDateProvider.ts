export class CurrentDateProvider {
  public provideCurrentDate(): Date {
    const currentDate = new Date();
    return currentDate;
  }
}
