import {Stream} from 'core/classes/stream.class';
import {connectionService, clientStateService} from "./core/services";

import { Server } from './server-logic';
import { Client } from './client-logic';


const connectionsStream = new Stream();

new Server(connectionsStream);
new Client(connectionService).init();

connectionsStream.next(connectionService);

clientStateService.isAlwaysMaximized$.next(true);
