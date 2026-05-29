/**
 * Esempio d'uso completo:
 *
 * import { FormControl, Validators } from '@angular/forms';
 * import { TYPE_CONTROL_FORM, DynamicFormActionButton } from './dynamic-form.interface';
 * import { DynamicFormBuilder } from './dynamic-form.builder';
 *
 * // Azioni di gruppo (bottoni in fondo al gruppo)
 * const salvaAction: DynamicFormActionButton = {
 *   label: 'Salva',
 *   visible: true,
 *   action: (questions, idForm, formGroup) => {
 *     // logica di salvataggio
 *     console.log('Salva cliccato', formGroup.value);
 *   }
 * };
 *
 * // Azione a livello di campo (es. bottone custom)
 * const customButton = {
 *   formName: 'bottoneCustom',
 *   type: TYPE_CONTROL_FORM.BUTTON,
 *   title: 'Clicca qui',
 *   action: () => alert('Hai cliccato il bottone!'),
 * };
 *
 * // Usa il builder guidato
 * const config = DynamicFormBuilder.create()
 *   .addGroup('Dati Anagrafici', ['col-12'])
 *     .addForm({
 *       formName: 'nome',
 *       title: 'Nome',
 *       type: TYPE_CONTROL_FORM.TEXT,
 *       formControl: new FormControl('', Validators.required),
 *     })
 *     .addForm(customButton)
 *     .addActions([salvaAction])
 *   .addGroup('Note')
 *     .addForm({
 *       formName: 'note',
 *       title: 'Note',
 *       type: TYPE_CONTROL_FORM.TEXTAREA,
 *       formControl: new FormControl(''),
 *     })
 *   .build();
 *
 * // Passa config a <app-dynamic-form [config]="config">
 *
 * // Ricorda:
 * // - .addActions() aggiunge bottoni/azioni al gruppo (footer del gruppo)
 * // - .action, .onChange, .onInitialize ecc. sono proprietà del singolo campo (FormAction)
 */
import { ConfigForm, DynamicFormActionButton, FormAction, Group } from './dynamic-form.interface';
import { uuidv4 } from './uuid.util';

/**
 * Builder fluente per la creazione di ConfigForm tipizzati.
 *
 * Il parametro generico `TCtx` rappresenta il tipo del contesto (tipicamente la classe
 * Component) passato a `create(context)`. Quando presente, `addGroup`, `addForm` e
 * `addActions` accettano anche una factory function `(ctx: TCtx) => <valore>`, che riceve
 * il contesto tipizzato e consente di accedere a proprietà e metodi del componente con
 * pieno supporto TypeScript.
 *
 * @example
 * ```ts
 * // Nel componente:
 * this.config = DynamicFormBuilder.create(this)
 *   .addGroup('Sezione')
 *   .addForm(ctx => ({
 *     formName: 'nome',
 *     type: TYPE_CONTROL_FORM.TEXT,
 *     formControl: new FormControl(''),
 *     onChange: () => ctx.onNomeChange(),   // ctx è tipizzato come il tuo Component
 *   }))
 *   .build();
 * ```
 */
export class DynamicFormBuilder<TCtx = unknown> {
    private _context!: TCtx;
    private groups: Group[] = [];
    private currentGroupIndex: number = -1;

    private constructor() { }

    /** Crea un builder senza contesto (i callback factory non riceveranno un ctx tipizzato). */
    static create(): DynamicFormBuilder<unknown>;
    /** Crea un builder con contesto tipizzato. Il tipo viene inferito automaticamente. */
    static create<T>(context: T): DynamicFormBuilder<T>;
    static create<T>(context?: T): DynamicFormBuilder<T | unknown> {
        const b = new DynamicFormBuilder<any>();
        if (context !== undefined) {
            b._context = context;
        }
        return b;
    }

    /**
     * Crea un nuovo gruppo e lo rende attivo per le addForm successive.
     * `title` può essere una stringa o una factory `(ctx) => string`.
     */
    addGroup(title: string | ((ctx: TCtx) => string), classList?: string[], id?: string): this {
        const resolvedTitle = typeof title === 'function' ? title(this._context) : title;
        const group: any = {
            title: resolvedTitle,
            class: classList,
            formGroup: [],
        };
        if (id) {
            group.id = id;
        }
        if (!group.id) {
            group.id = uuidv4();
        }
        this.groups.push(group);
        this.currentGroupIndex = this.groups.length - 1;
        return this;
    }

    /**
     * Aggiunge un campo al gruppo attivo.
     * `formAction` può essere un oggetto `FormAction` o una factory `(ctx) => FormAction`.
     */
    addForm(formAction: FormAction | ((ctx: TCtx) => FormAction)): this {
        if (this.currentGroupIndex === -1) {
            throw new Error('Devi prima chiamare addGroup(title) prima di addForm!');
        }
        const resolved: FormAction = typeof formAction === 'function' ? formAction(this._context) : formAction;
        if (!resolved.id) {
            resolved.id = uuidv4();
        }
        this.groups[this.currentGroupIndex].formGroup.push({ formAction: resolved });
        return this;
    }

    /**
     * Aggiunge azioni (bottoni) al gruppo attivo.
     * `actions` può essere un array o una factory `(ctx) => Array<DynamicFormActionButton>`.
     */
    addActions(actions: Array<DynamicFormActionButton> | ((ctx: TCtx) => Array<DynamicFormActionButton>)): this {
        if (this.currentGroupIndex === -1) {
            throw new Error('Devi prima chiamare addGroup(title) prima di addActions!');
        }
        const resolved = typeof actions === 'function' ? actions(this._context) : actions;
        this.groups[this.currentGroupIndex].actions = resolved;
        return this;
    }

    /**
     * Restituisce il ConfigForm pronto da passare a <app-dynamic-form [config]="...">
     * Lancia se non ci sono gruppi o se qualche gruppo è vuoto.
     */
    build(): ConfigForm {
        if (this.groups.length === 0) {
            throw new Error('Nessun gruppo aggiunto: usa addGroup prima di build!');
        }
        for (const g of this.groups) {
            if (!g.id) {
                g.id = uuidv4();
            }
            if (!g.formGroup || g.formGroup.length === 0) {
                throw new Error(`Il gruppo \"${g.title}\" non contiene campi: aggiungi almeno un addForm!`);
            }
            for (const f of g.formGroup) {
                if (f && f.formAction && !f.formAction.id) {
                    f.formAction.id = uuidv4();
                }
            }
        }
        return this.groups;
    }
}
