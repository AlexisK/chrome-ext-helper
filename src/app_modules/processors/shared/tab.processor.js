import { Processor, DomEl } from 'core/classes';
import { TabsProcessor } from './tabs.processor';
import {crDom} from 'core/helpers';

export const TabProcessor = new Processor({
    name    : 'tab',
    init    : (self, params) => {
        if ( !self.node._parent._processed || !self.node._parent._processed[TabsProcessor.name]) {
            console.error(self, 'Requires a', TabsProcessor, 'as parent!');
        } else {
            self.title = params.title || 'Tab';
            self.titleNode = new DomEl('div').cls('tab-title').value(self.title);
            self.tabsInstance = self.node._parent._processorInstances[TabsProcessor.name];
            self.tabsInstance.registerTab(self);
        }
    },
    process : (self) => {

    },
    destroy: (self) => {
        if ( self.tabsInstance ) {
            self.tabsInstance.destroyTab(self);
        }
        delete self.tabsInstance;
    }
});
