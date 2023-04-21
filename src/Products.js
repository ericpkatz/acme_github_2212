import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Products = ()=> {
  const { products } = useSelector(state => state);
  const { filterString } = useParams();
  const filter = filterString ? JSON.parse(filterString) : {};
  const navigate = useNavigate();

  const search = (ev)=> {
    const _filter = {...filter };
    if(ev.target.name === 'name'){
      if(ev.target.value){
        _filter.name = ev.target.value;
      }
      else {
        delete _filter.name
      }
    }
    if(ev.target.name === 'inStock'){
      if(ev.target.checked){
        _filter.inStock = true; 
      }
      else {
        delete _filter.inStock;
      }
    }

    navigate(`/products/${JSON.stringify(_filter)}`);
  };
  const filtered = products
    .filter( product => {
      if(filter.name && !product.name.includes(filter.name)){
        return false;
      }
      if(filter.inStock && !product.inStock){ 
        return false;
      }
      return true;
    });

  return (
    <div>
      <form onSubmit={ ev => ev.preventDefault() }>
        <input value={ filter.name ? filter.name : '' } autoComplete='off' name='name' onChange={ search }/>
        <label>
          In Stock only
          <input checked={ filter.inStock || false } type='checkbox' name='inStock' onChange={ search }/>
        </label>
      </form>
      <ul>
        {
          filtered.map( product => {
            return (
              <li key={ product.id }>
                { product.name }
                { product.inStock && <em> is in stock</em>}
              </li>
            );
          })
        }
      </ul>
      {
        !filtered.length ? <Link to='/products'>reset</Link> : null
      }
    </div>
  );
};

export default Products;
