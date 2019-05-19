var productsApi = Vue.resource('products{/id}');

function getUid(list, uuid) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].uuid === uuid) {
            return i;
        }
    }

    return -1;
}

Vue.component('products-form', {
    props: ['products', 'productInput'],
    data: function() {
        return {
            name: '',
            demand: '',
            uuid: ''
        }
    },
    watch: {
        productInput: function(input, oldInput) {
            this.name= input.name;
            this.demand = input.demand;
            this.uuid = input.uuid;
        }
    },
    template:
        '<div>' +
        '   <input type="text" placeholder="Наименование продукта" v-model="name"/>' +
        '   <input type="text" placeholder="Востребованность" v-model="demand"/>' +
        '   <input type="button" value="Сохранить" @click="save"/>' +
        '</div>',
    methods: {
        save: function () {
            const input = {
                name: this.name,
                demand: this.demand
            };

            if (this.uuid) {
                productsApi.update({uuid: this.uuid}, input).then(result =>
                    result.json().then(data => {
                        const index = getUid(this.products, data.uuid);
                        this.products.splice(index, 1, data);
                        this.uuid = '';
                    })
                )
            } else {
                productsApi.save({}, input).then(result =>
                    result.json().then(data => {
                        this.products.push(data);
                    })
                )
            }

            this.name = '';
            this.demand = '';
        }
    }
});

Vue.component('products-row', {
    props: ['product', 'products', 'editProduct'],
    template:
        '<div >' +
        '   {{ product.name }} {{ product.demand }}' +
        '   <span style="position: absolute; right: 0px;">' +
        '       <input type="button" value="Изменить" @click="edit"/>' +
        '       <input type="button" value="Удалить" @click="del"/>' +
        '   </span>' +
        '</div>',
    methods: {
        edit: function() {
            this.editProduct(this.product);
        },
        del: function() {
            productsApi.remove({uuid: this.product.uuid}).then(result => {
                if (result.ok) {
                    this.products.splice(this.products.indexOf(this.product), 1);
                }
            })
        }
    }
});

Vue.component('products-list', {
    props:  ['products'],
    data: function() {
        return {
            product: null
        }
    },
    template:
        '<div style="position: relative; width: 700px;">' +
        '   <products-form ' +
        '   :products="products" ' +
        '   :productInput="product">' +
        '   </products-form>' +
        '   <products-row v-for="product in products" ' +
        '       :key="product.uid" ' +
        '       :product="product" ' +
        '       :editProduct="editProduct" ' +
        '       :products="products">' +
        '   </products-row>' +
        '</div>',
    created: function() {
        productsApi.get().then(result =>
            result.json().then( data =>
                data.forEach(product =>
                    this.products.push(product))
            )
        )
    },
    methods: {
        editProduct: function(product) {
            this.product = product;
        }
    }
});

var productsApp = new Vue({
    el: '#products',
    template: '<products-list :products="products"/>',
    data: {
        products: []
    }
});
