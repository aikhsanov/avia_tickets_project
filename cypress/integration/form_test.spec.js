describe('Form', () => {
    it('When you visit site, form is visible', ()=> {
        cy.visit('http://localhost:9000/');
        cy.get('[data-hook=mainForm]').should('be.visible')
    })
    it('When typing a val into autocomplete, the autocomplete is visible and has input val', ()=> {
        //объявляем алиас для элемента, чтобы сократить описание эл-та
        cy.get('[data-hook=autocompleteOrigin]').as("autocompleteOrigin")
        //элемент отображается
        cy.get("@autocompleteOrigin").should('be.visible')
        //печатаем
        cy.get("@autocompleteOrigin").type("Москва")
        //значение должно быть равно напечатанному
        cy.get("@autocompleteOrigin").should("have.value","Москва")
    })

    it('When typing a val into autocomplete, the autocomplete is visible and has input val', ()=> {
        cy.get('[data-hook=autocompleteDestination]').as("autocompleteDestination")
        cy.get("@autocompleteDestination").should('be.visible')
        cy.get("@autocompleteDestination").type("Казань")
        cy.get("@autocompleteDestination").should("have.value","Казань")
    })

    it('When click on data input, modal window opens', ()=> {
        cy.get('[data-hook=datepickerDepartWrapper]').as("datepickerDepartWrapper")
        cy.get('[data-hook=datepickerDepartWrapper] .datepicker-container').as("modalWindow")
        cy.get('[data-hook=datepickerDepartInput]').as("datepickerDepartInput")
        cy.get('@datepickerDepartInput').click()
        cy.get('@modalWindow').should('be.visible')

    })
})
