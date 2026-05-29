/** @format */
import { platformBrowser } from '@angular/platform-browser';
import { WcBootstrapModule } from './app/wc-bootstrap.module';

platformBrowser().bootstrapModule(WcBootstrapModule).catch(err => console.error(err));
