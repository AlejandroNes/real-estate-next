# 🏡 Checklist: Mejores Prácticas para Real Estate en Next.js

## ⚡ 1. Rendimiento
* [ ] **Imágenes:** Usar siempre `<Image>` (`next/image`) con formatos modernos (WebP).
* [ ] **Lazy Loading:** Diferir mapas y tours 3D con `next/dynamic` para que no bloqueen la carga inicial.
* [ ] **Paginación:** Manejar listados masivos desde el servidor (paginación o *Infinite Scroll*).
* [ ] **Fuentes:** Usar `next/font` para cargar tipografías sin parpadeos.

## 🔍 2. SEO y Redes Sociales
* [ ] **Metadatos:** Títulos y descripciones dinámicos por cada propiedad.
* [ ] **Open Graph (OG):** Configurar previsualizaciones atractivas (foto + precio) para WhatsApp y redes.
* [ ] **Sitemap:** Generar `sitemap.xml` dinámico para rápida indexación de nuevas viviendas.
* [ ] **Schema Markup:** Implementar JSON-LD (`RealEstateListing`) para destacar en Google.

## 🏗️ 3. Arquitectura (App Router)
* [ ] **Renderizado (ISR):** Generar estáticamente las propiedades y revalidar en segundo plano al haber cambios.
* [ ] **Server Components:** Priorizar para el 80% de la UI (mejor SEO y menor JS al cliente).
* [ ] **Client Components:** Restringir `"use client"` a carruseles, mapas y filtros interactivos.

## 💎 4. Diseño y UX Premium
* [ ] **Búsqueda en URL:** Sincronizar filtros con la URL (`?ciudad=Madrid&precio=1M`) para permitir guardarlos y compartirlos.
* [ ] **Skeletons:** Usar *Skeleton Screens* (`loading.tsx`) en lugar de pantallas en blanco durante la carga.
* [ ] **Micro-interacciones:** Animaciones fluidas y sutiles (ej. hover en tarjetas de casas) para transmitir lujo.
* [ ] **Clustering de Mapas:** Agrupar pines de propiedades cuando hay muchas en una misma zona.

## 💾 5. Backend y Supabase
* [ ] **Tiempo Real:** Reflejar cambios de estado (ej. "Disponible" a "Vendido") en vivo sin recargar.
* [ ] **Caché Reactiva:** Evitar llamadas repetidas a la base de datos para datos estáticos (ciudades, tipos de inmueble).
* [ ] **Políticas (RLS):** Proteger la base de datos; solo admins pueden crear/editar propiedades.

## 💡 6. Funcionalidades Recomendadas (Ideas)
* [ ] **Wishlist (Favoritos):** Permitir a los usuarios guardar las propiedades que más les gustan.
* [ ] **Calculadora de Hipotecas:** Widget integrado en los detalles del inmueble.
* [ ] **Contacto Flash:** Formularios rápidos sin recarga usando *Server Actions*.
* [ ] **Soporte Multi-moneda:** Conversión dinámica (USD, EUR, MXN).
* [ ] **Tours 3D / Videos:** Integración nativa o Iframes optimizados para recorridos virtuales.
