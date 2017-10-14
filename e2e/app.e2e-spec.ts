import { ClientDatabasePage } from './app.po';

describe('client-database App', () => {
  let page: ClientDatabasePage;

  beforeEach(() => {
    page = new ClientDatabasePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
