import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ClientFormComponent} from './clients/client-form.component';
import {ClientDetailComponent} from './clients/client-detail.component';
import {ClientListComponent} from './clients/client-list.component';
import {AboutAuthorComponent} from './utils/about-author.component';
import {PathNotFoundComponent} from './utils/path-not-found.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {ClientService} from './clients/client.service';
import {AddressService} from './addresses/address.service';
import {ClientDetailResolver} from './clients/client-detail-resolver.service';
import {AddressDetailResolver} from './addresses/address-detail-resolver.service';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {CanActivateAuthGuard} from './login/can-activate-authguard';
import {AuthenticationService} from './login/authentication.service';
import {ClientListResolver} from './clients/client-list-resolver';
import {ValidationAndLocaleMessagesService} from './shared/validation-and-locale-messages.service';
import {BOOTBOX_TOKEN, bootboxFactory} from './utils/bootbox';
import {AddressFormComponent} from './addresses/address-form.component';

import './shared/rxjs-operators';

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientDetailComponent,
    ClientFormComponent,
    PathNotFoundComponent,
    AboutAuthorComponent,
    AddressFormComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en'},
    {provide: BOOTBOX_TOKEN, useFactory: bootboxFactory},
    ClientService,
    ClientDetailResolver,
    ClientListResolver,
    AddressService,
    AddressDetailResolver,
    AuthenticationService,
    CanActivateAuthGuard,
    ValidationAndLocaleMessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
