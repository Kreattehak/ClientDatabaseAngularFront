import {InjectionToken} from '@angular/core';
// Moved to separate file because of circular dependency issue.
export const BOOTBOX_TOKEN = new InjectionToken<any>('bootbox');

export function bootboxFactory() {
  return window['bootbox'];
}
