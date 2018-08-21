import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Connection extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Link to="/products/">Product List</Link>
          {" | "}
          <Link to="/products/new">New Product</Link>
          {" | "}
          <Link to="/products/id/edit">Update Product</Link>
          <hr />
          <Route
            exact
            path="/products/"
            render={props => (
              <Listitem
                products={this.props.products}
                editProduct={this.props.editProduct}
                deleteProduct={this.props.deleteProduct}
              />
            )}
          />

          <Route
            path="/products/new"
            render={props => (
              <Newitem
                products={this.props.products}
                addProduct={this.props.addProduct}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

class Listitem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props.products);
    return this.props.products.map((product, index) => {
      return (
        <Eachitem
          key={index}
          product={product}
          editProduct={this.props.editProduct}
          deleteProduct={this.props.deleteProduct}
        />
      );
    });
  }
}

class Eachitem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    };
    this.changeEditable = this.changeEditable.bind(this);
  }
  changeEditable() {
    this.setState({
      editable: !this.state.editable
    });
  }
  render() {
    return (
      <div>
        {this.state.editable ? (
          <EditForm
            name={this.props.product.name}
            price={this.props.product.price}
            qty={this.props.product.qty}
            id={this.props.product.id}
            editProduct={this.props.editProduct}
            deleteProduct={this.props.deleteProduct}
            changeEditable={this.changeEditable}
          />
        ) : (
          <li>
            <span>id</span> | <span>Name</span> | <span>Qty</span> |{" "}
            <span>Price</span> | <span>Action</span>
            <br />
            {this.props.product.id}
            {" | "}
            {this.props.product.name}
            {" | "}
            {this.props.product.qty}
            {" | "}
            {"$" + this.props.product.price}
            <button
              onClick={() => {
                this.setState({ editable: true });
              }}
            >
              {" "}
              Edit{" "}
            </button>
            <button
              onClick={() => {
                this.props.deleteProduct(this.props.product.id);
              }}
            >
              Delete
            </button>
          </li>
        )}
      </div>
    );
  }
}

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      editName: props.name,
      editQty: props.qty,
      editPrice: props.price,
      field: {},
      error: {}
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleNameChange(e) {
    let changeName = this.state.field;
    changeName[e.target.name] = e.target.value;
    this.setState({
      changeName,
      editName: e.target.value
    });
  }
  handleQtyChange(e) {
    console.log("handleQtychange in Editform");
    let changeQty = this.state.field;
    changeQty[e.target.qty] = e.target.value;
    this.setState({
      changeQty,
      editQty: e.target.value
    });
  }
  handlePriceChange(e) {
    let changePrice = this.state.field;
    changePrice[e.target.price] = e.target.value;
    this.setState({
      changePrice,
      editPrice: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.validateEdit()) {
      let submitForm = {};
      submitForm["this.props.name"] = "";
      submitForm["this.props.qty"] = "";
      submitForm["this.props.price"] = "";
      console.log("handle submit function in EditForm");
      this.props.editProduct(
        this.state.id,
        this.state.editName,
        this.state.editQty,
        this.state.editPrice
      );
      this.props.changeEditable();
    }
  }
  validateEdit() {
    // let field = this.state.field;
    let error = {};
    let formValid = true;

    // if (!field["this.state.name"]) {
    if (!this.state.editName) {
      formValid = false;
      error["name"] = "* Please enter your product name";
    }
    if (typeof this.state.editName !== "undefined") {
      if (this.state.editName.length < 3) {
        formValid = false;
        error["name"] = "* please enter more than 3 characters";
      }
    }

    if (!this.state.editQty) {
      formValid = false;
      error["qty"] = "* Please enter your Qty";
    }
    if (typeof this.state.editQty !== "undefined") {
      if (this.state.editQty < 0) {
        formValid = false;
        error["qty"] = "* please enter quantity more than 1";
      }
    }

    if (!this.state.editPrice) {
      formValid = false;
      error["price"] = " * Please enter your product price";
    }
    this.setState({
      error: error
    });
    return formValid;
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="editName"
            value={this.state.editName}
            onChange={this.handleNameChange}
          />
          <div style={{ color: "red" }} className="errorMsg">
            {this.state.error.name}
          </div>

          <input
            type="number"
            name="editQty"
            value={this.state.editQty}
            onChange={this.handleQtyChange}
          />
          <div style={{ color: "red" }} className="errorMsg">
            {this.state.error.qty}
          </div>

          <input
            type="number"
            name="editPrice"
            value={this.state.editPrice}
            onChange={this.handlePriceChange}
          />
          <div style={{ color: "red" }} className="errorMsg">
            {this.state.error.price}
          </div>
          <input type="submit" value="save" />
        </form>
      </div>
    );
  }
}

class Newitem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productQty: 0,
      productPrice: 0,
      fields: {},
      errors: {}
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(e) {
    let changeName = this.state.fields;
    changeName[e.target.name] = e.target.value;
    this.setState({
      changeName,
      productName: e.target.value
    });
  }
  handleQtyChange(e) {
    let changeQty = this.state.fields;
    changeQty[e.target.qty] = e.target.value;
    this.setState({
      changeQty,
      productQty: e.target.value
    });
  }
  handlePriceChange(e) {
    let changePrice = this.state.fields;
    changePrice[e.target.price] = e.target.value;
    this.setState({
      changePrice,
      productPrice: e.target.value
    });
  }

  handleClear() {
    this.setState({
      productName: "",
      productQty: "",
      productPrice: ""
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      let submitField = {};
      submitField["productName"] = "";
      submitField["productQty"] = "";
      submitField["productPrice"] = "";

      this.props.addProduct(
        this.state.productName,
        this.state.productQty,
        this.state.productPrice
      );
      this.handleClear();
      console.log("product has created", this.props.products);
    }
  }
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formValid = true;

    if (!fields["productName"]) {
      formValid = false;
      errors["productName"] = "* please enter your product name";
    }
    if (typeof fields["productName"] !== "undefined") {
      if (fields["productName"].length < 3) {
        formValid = false;
        errors["productName"] =
          "* your product name must be more than 3 characters";
      }
    }

    if (!this.state.productQty) {
      console.log(this.state.fields);
      formValid = false;
      errors["productQty"] = "* please enter your product Qty";
    }
    if (typeof fields["productQty"] !== "undefined") {
      if (fields["productQty"] < 0) {
        formValid = false;
        errors["productName"] = "* your Qty must be more than 1 ";
      }
    }

    if (!this.state.productPrice) {
      formValid = false;
      errors["productPrice"] = "* please enter your product price";
    }

    this.setState({
      errors: errors
    });
    return formValid;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>New Product</h1>
        <input
          type="text"
          placeholder="product name"
          name="productName"
          value={this.state.productName}
          onChange={this.handleNameChange}
        />
        <div style={{ color: "red" }} className="errorMsg">
          {this.state.errors.productName}
        </div>

        <input
          type="number"
          placeholder="product Qty"
          name="productQty"
          value={this.state.productQty}
          onChange={this.handleQtyChange}
        />
        <div style={{ color: "red" }} className="errorMsg">
          {this.state.errors.productQty}
        </div>
        <input
          type="number"
          placeholder="product price"
          name="productPrice"
          value={this.state.productPrice}
          onChange={this.handlePriceChange}
        />
        <div style={{ color: "red" }} className="errorMsg">
          {this.state.errors.productPrice}
        </div>
        <input type="submit" value="Reset" />
        <input type="submit" value="Create" />
      </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        { id: 1, name: "Keyboard", qty: 439, price: 99.98 },
        { id: 2, name: "Mouse", qty: 783, price: 59.98 },
        { id: 3, name: "Projector", qty: 59, price: 1999 },
        { id: 4, name: "AI Assistant", qty: 131, price: 9999.98 }
      ]
    };
    this.addProduct = this.addProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }
  addProduct(name, qty, price) {
    if (this.state.products[this.state.products.length - 1]) {
      const id = this.state.products[this.state.products.length - 1];
      this.setState({
        products: [
          ...this.state.products,
          { id: id, name: name, qty: qty, price: price }
        ]
      });
    } else {
      this.setState({
        products: [
          ...this.state.products,
          { id: 1, name: name, qty: qty, price: price }
        ]
      });
    }
  }

  editProduct(productId, newName, newQty, newPrice) {
    let newProducts = this.state.products;
    for (var idx = 0; idx < newProducts.length; idx++) {
      if (newProducts[idx].id === productId) {
        newProducts[idx]["name"] = newName;
        newProducts[idx]["qty"] = newQty;
        newProducts[idx]["price"] = newPrice;

        return this.setState({
          products: newProducts
        });
      }
    }
  }

  deleteProduct(productId) {
    for (var idx = 0; idx < this.state.products.length; idx++) {
      if (this.state.products[idx].id === productId) {
        this.state.products.splice(idx, 1);
        return this.setState({
          products: this.state.products
        });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Commerce Manager</h1>
        </header>
        <Connection
          products={this.state.products}
          addProduct={this.addProduct}
          editProduct={this.editProduct}
          deleteProduct={this.deleteProduct}
        />
      </div>
    );
  }
}

export default App;
