import {bootboxFactory} from '../../app/utils/bootbox';

describe('Bootbox', () => {
  it('should return bootbox object', () => {
    const data = {field: 'value'};
    window['bootbox'] = data;

    const bootbox = bootboxFactory();
    expect(bootbox).toBe(data);
  });
});
