import {Processor, DomEl} from 'core/classes';
import {crDom} from 'core/helpers';

export const TabsProcessor = new Processor({
    name: 'tabs',
    init: (self) => {
        self.titleContainer = new DomEl('div').cls('tabs-title').attachTo(self.node);
        self.bodyContainer = new DomEl('div').cls('tabs-body').attachTo(self.node);

        self.tabInstances = [];
        self.activeTabInstance = null;

        self.registerTab = (tabInstance) => {
            tabInstance._activateWorker = () => self.activateTab(tabInstance);

            tabInstance.titleNode.attachTo(self.titleContainer);
            tabInstance.titleNode.addEventListener('click', tabInstance._activateWorker);
            if ( tabInstance.node.parentNode ) {
                tabInstance.node.parentNode.removeChild(tabInstance.node);
            }
            self.tabInstances.push(tabInstance);
        };

        self.destroyTab = (tabInstance) => {
            let ind = self.tabInstances.indexOf(tabInstance);
            if ( ind >= 0 ) {
                self.tabInstances.splice(ind, 1);
            }
            tabInstance.titleNode.removeEventListener('click', tabInstance._activateWorker);
            this.titleContainer.removeChild(tabInstance.titleNode);
        };

        self.activateTab = (tabInstance) => {
            if ( self.activeTabInstance ) {
                self.activeTabInstance.titleNode.node.classList.remove('active');
                self.bodyContainer.removeChild(self.activeTabInstance.node);
            }
            self.bodyContainer.appendChild(tabInstance.node);
            tabInstance.titleNode.node.classList.add('active');
            self.activeTabInstance = tabInstance;
        }
    },
    process: (self) => {
        if ( !self.activeTabInstance && self.tabInstances.length ) {
            self.activateTab(self.tabInstances[0]);
        }
    }
});
