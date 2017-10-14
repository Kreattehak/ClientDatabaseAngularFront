import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ClientFormComponent} from './clients/client-form.component';
import {ClientDetailComponent} from './clients/client-detail.component';
import {ClientListComponent} from './clients/client-list.component';
import {AboutUsComponent} from './utils/about-us.component';
import {PathNotFoundComponent} from './utils/path-not-found.component';
import {AddressDetailComponent} from './addresses/address-detail.component';
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

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientDetailComponent,
    ClientFormComponent,
    PathNotFoundComponent,
    AboutUsComponent,
    AddressDetailComponent,
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
    ClientService,
    ClientDetailResolver,
    ClientListResolver,
    AddressService,
    AddressDetailResolver,
    AuthenticationService,
    CanActivateAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
