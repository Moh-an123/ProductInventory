import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedProduct: Product | null = null;
  
  productForm: Product = {
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    description: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        alert('Failed to load products. Please try again.');
      }
    });
  }

  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.productForm = {
      name: '',
      category: '',
      price: 0,
      quantity: 0,
      description: ''
    };
    this.selectedProduct = null;
  }

  saveProduct(): void {
    if (this.isEditMode && this.selectedProduct?._id) {
      this.productService.updateProduct(this.selectedProduct._id, this.productForm).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product. Please try again.');
        }
      });
    } else {
      this.productService.createProduct(this.productForm).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to add product. Please try again.');
        }
      });
    }
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
}