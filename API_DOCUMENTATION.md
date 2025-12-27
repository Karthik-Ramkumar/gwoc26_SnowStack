# Basho API Documentation

## Base URL
```
http://127.0.0.1:8000/api
```

---

## Products Page APIs

1. **GET** `/api/products/` - List all products (with filters: category, featured, search, sort)
2. **GET** `/api/products/{product_id}/` - Get product details
3. **POST** `/api/calculate-shipping/` - Calculate shipping cost

---

## Custom Orders Page APIs

4. **POST** `/api/custom-orders/` - Create custom order
5. **GET** `/api/custom-orders/` - List custom orders

---

## Workshops Page APIs

6. **GET** `/api/workshops/` - List workshops (with filters: type, difficulty, featured, popular)
7. **GET** `/api/workshops/{id}/` - Get workshop details
8. **GET** `/api/workshops/{id}/slots/` - Get available slots for workshop
9. **GET** `/api/slots/` - List all workshop slots
10. **POST** `/api/registrations/` - Create workshop registration
11. **GET** `/api/registrations/` - List registrations
12. **GET** `/api/registrations/{id}/` - Get registration details

---

## Pages Without APIs

- **Home** - Static page
- **Corporate** - Static page
- **Inspiration** - Static page
- **Founder** - Static page
- **Studio** - Static page
- **Media** - Static page
