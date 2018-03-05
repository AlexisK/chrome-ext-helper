import {Application, DomEl} from "core/classes";
import {secureEval} from "core/utils";

export const CalculatorApplication = new Application({
    title: 'Calculator',
    description: 'Uses JS eval',
    icon: './svg/calculator.svg',
    defaultData: {
        expression: '2+2'
    },
    createView: function() {
        this.rootNode = new DomEl('div').cls('app-application-calculator');
        this.expressionInputNode = this.rootNode.cr('textarea').value(this.data.expression);
        this.resultNode = this.rootNode.cr('strong');

        this.expressionInputNode.addEventListener('keyup', ev => {
            if ( ev.keyCode === 13 ) {
                ev.preventDefault();
                this.data.expression = this.expressionInputNode.getValue();
                this.save();
            }
        });

        this.ev.subscribe('data', () => {
            try {
                secureEval(this.data.expression).then(result => {
                    this.resultNode.value(result);
                });
            } catch(err) {
                this.resultNode.value('ERR!');
            }
        });

        return [this.rootNode];
    }
});
