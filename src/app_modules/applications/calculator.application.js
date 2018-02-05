import {Application} from "core/classes";

export const CalculatorApplication = new Application({
    title: 'Calculator',
    description: 'Uses JS eval',
    icon: './svg/calculator.svg',
    defaultData: {
        lastExpression: '2+2'
    }
});
