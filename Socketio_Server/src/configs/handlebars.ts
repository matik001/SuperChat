import express from 'express';
import { create } from 'express-handlebars';

const configureHandlebars = (app:express.Express)=>{
    const hbs = create({
            extname: '.hbs',
            helpers: {
                ternary(cond:boolean, ifTrue:string, ifFalse:string) { 
                    return cond ? ifTrue : ifFalse; 
                },
                eq(a:string, b:string){
                    return a===b;
                },
                add(a:number, b:number){
                    return a+b;
                },
                concat(...args : Array<string>){
                    args.pop();
                    return args.join('')
                },
                formatDate(date:Date){
                    return date.toLocaleDateString("pl-Pl")
                },
                section: function (name:string, options:any) {
                    if (!this._sections) {
                        this._sections = {};
                    }
                    (this._sections as any)[name] = options.fn(this);
                    return null;
                },
                formatPrice(price:number){
                    return `${price.toFixed(2)} PLN`;
                },
                or(a:any, b:any){
                    return a || b;
                },
                orNull(a:any, b:any){
                    return a ?? b;
                }
                // bar() { return 'BAR!'; }
            }
        });
      
        app.engine('hbs', hbs.engine);
        app.set('view engine', 'hbs');
        // if(ENV_KEYS.IS_PRODUCTION)
        //     app.enable('view cache');

}

export default configureHandlebars;