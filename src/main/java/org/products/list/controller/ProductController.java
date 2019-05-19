package org.products.list.controller;

import org.products.list.entity.Product;
import org.products.list.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("products")
public class ProductController {
    private final ProductRepository productRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    public ProductController(ProductRepository productRepo) {
        this.productRepository = productRepo;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @GetMapping("{uuid}")
    public Product getProduct(@PathVariable("uuid") Product productFromRepo) {
        return productFromRepo;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("{uuid}")
    public Product edit( @PathVariable("uuid") Product productFromRepo, @RequestBody Product product) {
        BeanUtils.copyProperties(product, productFromRepo, "uuid");
        return productRepository.save(productFromRepo);
    }

    @DeleteMapping("{uuid}")
    public void delete(@PathVariable("uuid") Product productFromRepo) {
        productRepository.delete(productFromRepo);
    }
}
