import {Stream} from 'core/classes/stream.class';
import {connectionService, clientStateService, domRefService} from "./core/services";

import { Server } from './server-logic';
import { Client } from './client-logic';


const connectionsStream = new Stream();

new Server(connectionsStream);
new Client(connectionService).init();

connectionsStream.next(connectionService);

domRefService.REF['mainContent'].classList.add('mobile');

navigator.serviceWorker.register('service-worker-dummy.js', { scope: '/'});
