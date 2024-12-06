import React, { useRef, useState, useEffect } from "react";
import productService from "../../services/product.service";
import Product from"../../model/Product";
import ProductSave from "../../components/ProductSave";
import ProductDelete from "../../components/ProductDelete";

const Admin =() =>{
    const [productList, setProductList]=useState([]);
    const [selectedProduct, setSelectedProduct]=useState(new Product('','',0));
    const saveComponent=useRef(); //뭔가를 참조 한다 -> <ProductSave ref={saveComponent} product={selectedProduct} onSaved={(p)=>saveProductWatcher(p)}/>
    const [errorMessage, setErrorMessage]=useState('');
    const deleteComponent=useRef();

    useEffect(()=>{
        productService.getAllProducts().then((response) =>{
            setProductList(response.data);
        });
    },[productList]);

    const createProductRequest = () => {
		saveComponent.current?.showProductModal();
	};

    const saveProductWatcher=(product) =>{
        console.log(product);
        let itemIndex=productList.findIndex((item) => item.id===product.id);
        if(itemIndex!==-1){  //수정일 때
            const newList=productList.map((item)=>{
                if(item.id===product.id){
                    return product;
                }
                return item;
            });
            setProductList(newList)
        }else{ //저장일 때
            const newList=productList.concat(product);
            setProductList(newList);
        } 
    }
    
    const editProductRequest=(item) => {
        console.log(item);
        setSelectedProduct(item);
        saveComponent.current?.showProductModal()
    }

    const deleteProduct=()=>{
        //if(!window.confirm('정말로 삭제하겠습니까?')) return;
        productService
        .deleteProduct(selectedProduct)
        .then((_)=>{
            setProductList(productList.filter((p)=>p.id !==selectedProduct.id))
        })
        .catch((err)=>{
            setErrorMessage("삭제중 에러 발생!");
            console.log(err);
        })
    };

    const deleteProductRequest=(item) =>{
        console.log(item);
        setSelectedProduct(item);
        deleteComponent.current?.showDeleteModel();
    }


    return (
        <div className="container">
            <div className="'card mt-5">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="card-haeder">
                    <div className="col-6"><h3>모든 제품들</h3></div>
                    <div className="col-6 text-end">
                        <button className="btn btn-primary" onClick={createProductRequest}>새 제품</button>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {productList.map((item, ind)=>(
                            <tr key={item.id}>
                                <th scope="row">{ind+1}</th>
                                <td>{item.name}</td>
                                <td>{`${item.price}원`}</td>
                                <td>{new Date(item.createTime).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-primary me-1" onClick={()=>editProductRequest(item)}>수정</button>
                                    <button className="btn btn-danger" onClick={()=>deleteProductRequest(item)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProductSave ref={saveComponent} product={selectedProduct} onSaved={(p)=>saveProductWatcher(p)}/>
            <ProductDelete ref={deleteComponent} onConfirmed={()=> deleteProduct()} />
        </div>
    );
}
export default Admin;