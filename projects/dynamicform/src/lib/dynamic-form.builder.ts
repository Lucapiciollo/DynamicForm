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
import { ConfigForm, FormAction, Group } from './dynamic-form.interface';
import { uuidv4 } from './uuid.util';

export class DynamicFormBuilder {
    private groups: Group[] = [];
    private currentGroupIndex: number = -1;

    static create(): DynamicFormBuilder {
        return new DynamicFormBuilder();
    }

    /**
     * Crea un nuovo gruppo e lo rende attivo per le addForm successive.
     * Se chiamato più volte, chiude il gruppo precedente.
     */
    addGroup(title: string, classList?: string[], id?: string): this {
        const group: any = {
            title,
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
     * Se non esiste un gruppo, lancia un errore guidato.
     */
    addForm(formAction: FormAction): this {
        if (this.currentGroupIndex === -1) {
            throw new Error('Devi prima chiamare addGroup(title) prima di addForm!');
        }
        if (!formAction.id) {
            formAction.id = uuidv4();
        }
        this.groups[this.currentGroupIndex].formGroup.push({ formAction });
        return this;
    }

    /**
     * Aggiunge azioni (bottoni) al gruppo attivo.
     * Se non esiste un gruppo, lancia un errore guidato.
     */
    addActions(actions: Array<import('./dynamic-form.interface').DynamicFormActionButton>): this {
        if (this.currentGroupIndex === -1) {
            throw new Error('Devi prima chiamare addGroup(title) prima di addActions!');
        }
        this.groups[this.currentGroupIndex].actions = actions;
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
