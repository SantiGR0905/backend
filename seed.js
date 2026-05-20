const { getDatabase, closeDatabase } = require('./config/database');
const bcrypt = require('bcryptjs');

// Categorías de productos
const categories = [
  "Cemento, cal y yeso", "Bloques y ladrillos", "Hierro y acero",
  "Áridos", "Maderas", "Tejas", "Chapa y cubiertas metálicas",
  "Aislantes", "Revestimientos cerámicos", "Pisos", "Pinturas",
  "Plomería", "Electricidad", "Fijaciones", "Herramientas manuales",
  "Puertas y ventanas", "Andamios", "Jardinería", "Adhesivos"
];

// Productos de ejemplo
const sampleProducts = [
  {
    name: "Cemento Gris 42.5 kg",
    price: 12500,
    category: "Cemento, cal y yeso",
    subcategory: "Cemento",
    image: "/uploads/products/cementoGris.png",
    description: "Ideal para hormigón armado. Resistencia óptima para construcciones estructurales.",
    stock: 100
  },
  {
    name: "Ladrillo Hueco 12x18x33",
    price: 850,
    category: "Bloques y ladrillos",
    subcategory: "Ladrillos",
    image: "/uploads/products/ladrilloHueco.jpg",
    description: "Ladrillo cerámico hueco para paredes interiores y exteriores.",
    stock: 5000
  },
  {
    name: "Hierro del 12 mm x 12 m",
    price: 4500,
    category: "Hierro y acero",
    subcategory: "Barras",
    image: "/uploads/products/hierro.jpeg",
    description: "Barra de acero corrugado para estructuras de hormigón.",
    stock: 200
  },
  {
    name: "Arena Fina x m3",
    price: 18000,
    category: "Áridos",
    subcategory: "Arenas",
    image: "/uploads/products/arenaFina.png",
    description: "Arena fina lavada para morteros y hormigón.",
    stock: 50
  },
  {
    name: "Madera Pino x 3m",
    price: 3200,
    category: "Maderas",
    subcategory: "Maderas",
    image: "/uploads/products/maderaPino.png",
    description: "Madera de pino tratada para estructuras.",
    stock: 300
  },
  {
    name: "Teja Española",
    price: 850,
    category: "Tejas",
    subcategory: "Tejas cerámicas",
    image: "/uploads/products/tejaEspañola.png",
    description: "Teja cerámica tradicional color terracota.",
    stock: 1000
  },
  {
    name: "Pintura Látex Blanca x 20 L",
    price: 35000,
    category: "Pinturas",
    subcategory: "Látex",
    image: "/uploads/products/pinturaBlanca.png",
    description: "Pintura látex para interiores y exteriores. Excelente cobertura.",
    stock: 50
  },
  {
    name: "Cable Eléctrico 2.5 mm x 100 m",
    price: 12000,
    category: "Electricidad",
    subcategory: "Cables",
    image: "/uploads/products/cableElectrico.png",
    description: "Cable unipolar para instalaciones eléctricas domiciliarias.",
    stock: 150
  },
  {
    name: "Taladro Percutor 650W",
    price: 45000,
    category: "Herramientas manuales",
    subcategory: "Herramientas eléctricas",
    image: "/uploads/products/taladroPercutor.png",
    description: "Taladro percutor profesional con maletín.",
    stock: 25
  },
  {
    name: "Adhesivo Cerámico x 25 kg",
    price: 8500,
    category: "Adhesivos",
    subcategory: "Adhesivos cerámicos",
    image: "/uploads/products/adhesivoCeramico.png",
    description: "Adhesivo para cerámicos y porcelanatos.",
    stock: 200
  }
];

// Solo ADMIN
const initialUsers = [
  {
    name: "Admin",
    email: "admin@elcimiento.com",
    password: "Admin$2025!Seguro",
    role: "admin",
    avatar: "👷",
    description: "Administrador del sistema"
  }
];

// Usuarios adicionales
const additionalUsers = [
  { name: "María González", email: "maria@example.com", password: "Mari@Construc2025", role: "user", avatar: "👩", description: "Arquitecta independiente" },
  { name: "Juan Pérez", email: "juan@example.com", password: "JuanP#7fGt9", role: "user", avatar: "👨", description: "Maestro mayor de obras" },
  { name: "Laura Fernández", email: "laura@example.com", password: "L4ur4!Secur3", role: "user", avatar: "👩‍🏭", description: "Ingeniera civil" },
  { name: "Roberto Gómez", email: "roberto@example.com", password: "R0b3rt0@2025", role: "user", avatar: "🧑", description: "Constructor particular" },
  { name: "Ana Martínez", email: "ana@example.com", password: "An@Martinez#99", role: "user", avatar: "👩‍🔧", description: "Diseñadora de interiores" },
  { name: "Carlos López", email: "carlos@example.com", password: "Cl0pez!Secure", role: "user", avatar: "👨‍🏭", description: "Electricista matriculado" },
  { name: "Sofía Ramírez", email: "sofia@example.com", password: "S0f!aR@mirez", role: "user", avatar: "👩‍🎨", description: "Decoradora de interiores" },
  { name: "Diego Torres", email: "diego@example.com", password: "Di3goT0rres#", role: "user", avatar: "🧔", description: "Arquitecto" },
  { name: "Valentina Herrera", email: "valentina@example.com", password: "V@l3ntin@H", role: "user", avatar: "👩‍🔧", description: "Albañil profesional" },
  { name: "Fernando Díaz", email: "fernando@example.com", password: "F3rn@nd0D1az", role: "user", avatar: "👨‍🔧", description: "Constructor" }
];

// Información personal con datos
const personalData = [
  { user_email: "admin@elcimiento.com", phone: "+57 311 1234567", address: "Calle 70 # 8-41, Chapinero, Bogotá", birth_date: "1980-05-15", dni: "1012345678" },
  { user_email: "maria@example.com", phone: "+57 312 9876543", address: "Carrera 43A # 10-15, El Poblado, Medellín", birth_date: "1985-03-12", dni: "2712345678" },
  { user_email: "juan@example.com", phone: "+57 313 4567890", address: "Calle 13 # 12-34, Centro, Cali", birth_date: "1975-07-22", dni: "1412345678" },
  { user_email: "laura@example.com", phone: "+57 314 5678901", address: "Carrera 53 # 45-67, Alto Prado, Barranquilla", birth_date: "1992-11-05", dni: "3512345678" },
  { user_email: "roberto@example.com", phone: "+57 315 6789012", address: "Calle 34 # 22-10, Cabecera, Bucaramanga", birth_date: "1988-09-18", dni: "2912345678" },
  { user_email: "ana@example.com", phone: "+57 316 7890123", address: "Carrera 19 # 8-50, El Golf, Cartagena", birth_date: "1995-01-30", dni: "4012345678" },
  { user_email: "carlos@example.com", phone: "+57 317 8901234", address: "Calle 26 # 15-20, Centro, Ibagué", birth_date: "1983-06-14", dni: "3112345678" },
  { user_email: "sofia@example.com", phone: "+57 318 9012345", address: "Carrera 5 # 20-30, La Merced, Pereira", birth_date: "1987-09-25", dni: "3212345678" },
  { user_email: "diego@example.com", phone: "+57 319 0123456", address: "Calle 8 # 10-15, La Florida, Cúcuta", birth_date: "1991-12-03", dni: "3312345678" },
  { user_email: "valentina@example.com", phone: "+57 320 1234567", address: "Carrera 22 # 12-45, Lago Gaitán, Villavicencio", birth_date: "1993-04-18", dni: "3412345678" },
  { user_email: "fernando@example.com", phone: "+57 321 2345678", address: "Calle 45 # 8-20, El Cable, Manizales", birth_date: "1982-08-07", dni: "2812345678" }
];

// Tarjetas de crédito 
const creditCards = [
  { user_email: "admin@elcimiento.com", card_number: "4532-1234-5678-9012", holder: "Admin Perez", exp: "12/28", cvv: "123", type: "Visa" },
  { user_email: "admin@elcimiento.com", card_number: "5412-3456-7890-1234", holder: "Admin Perez", exp: "10/26", cvv: "456", type: "Mastercard" },
  { user_email: "maria@example.com", card_number: "3782-8224-6310-005", holder: "Maria Gonzalez", exp: "08/29", cvv: "1234", type: "American Express" },
  { user_email: "juan@example.com", card_number: "4912-3456-7890-1234", holder: "Juan Perez", exp: "03/25", cvv: "321", type: "Visa" },
  { user_email: "juan@example.com", card_number: "5500-0000-1111-2222", holder: "Juan Perez", exp: "11/28", cvv: "987", type: "Mastercard" },
  { user_email: "laura@example.com", card_number: "4539-8888-7777-6666", holder: "Laura Fernandez", exp: "07/30", cvv: "654", type: "Visa" },
  { user_email: "roberto@example.com", card_number: "5300-1234-5678-9012", holder: "Roberto Gomez", exp: "01/27", cvv: "111", type: "Mastercard" },
  { user_email: "ana@example.com", card_number: "4916-2345-6789-0123", holder: "Ana Martinez", exp: "09/26", cvv: "222", type: "Visa" },
  { user_email: "carlos@example.com", card_number: "5412-3456-7890-1234", holder: "Carlos Lopez", exp: "04/29", cvv: "333", type: "Mastercard" },
  { user_email: "sofia@example.com", card_number: "6011-1234-5678-9012", holder: "Sofia Ramirez", exp: "12/27", cvv: "444", type: "Discover" },
  { user_email: "diego@example.com", card_number: "4532-3456-7890-1234", holder: "Diego Torres", exp: "06/28", cvv: "555", type: "Visa" },
  { user_email: "valentina@example.com", card_number: "5500-9876-5432-1098", holder: "Valentina Herrera", exp: "10/30", cvv: "666", type: "Mastercard" },
  { user_email: "fernando@example.com", card_number: "3782-8224-6310-605", holder: "🚩💾 ¡Bandera SQLI! 💾🚩", exp: "02/26", cvv: "777", type: "American Express" },
];

// Órdenes de compra (sin cambios)
const orders = [
  { user_email: "maria@example.com", product_id: 2, quantity: 10, total: 8500, status: "pending", order_date: "2025-05-15" },
  { user_email: "juan@example.com", product_id: 3, quantity: 1, total: 4500, status: "completed", order_date: "2025-05-01" },
  { user_email: "laura@example.com", product_id: 1, quantity: 5, total: 62500, status: "shipped", order_date: "2025-05-12" },
  { user_email: "roberto@example.com", product_id: 4, quantity: 3, total: 54000, status: "completed", order_date: "2025-05-08" },
  { user_email: "ana@example.com", product_id: 5, quantity: 2, total: 6400, status: "completed", order_date: "2025-05-20" }
];

async function seedDatabase() {
  try {
    const db = await getDatabase();

    // Crear tablas adicionales si no existen
    console.log('Creando tablas si es necesario...');
    await db.exec(`
      CREATE TABLE IF NOT EXISTS credit_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        card_number TEXT NOT NULL,
        card_holder TEXT NOT NULL,
        expiration_date TEXT NOT NULL,
        cvv TEXT NOT NULL,
        type TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS personal_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        phone TEXT,
        address TEXT,
        birth_date TEXT,
        dni TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total INTEGER NOT NULL,
        status TEXT,
        order_date TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    // Verificar si ya hay datos
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    
    if (userCount.count === 0) {
      // --- Insertar usuarios ---
      const userIds = [];

      // Usuarios iniciales (solo admin)
      for (const user of initialUsers) {
        const hashedPass = await bcrypt.hash(user.password, 10);
        const result = await db.run(`
          INSERT INTO users (name, email, password, description, role, avatar)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [user.name, user.email, hashedPass, user.description, user.role, user.avatar]);
        userIds.push({ id: result.lastID, email: user.email });
        console.log(`✅ Usuario ${user.email} creado (ID: ${result.lastID})`);
      }

      // Usuarios adicionales
      for (const user of additionalUsers) {
        const hashedPass = await bcrypt.hash(user.password, 10);
        const result = await db.run(`
          INSERT INTO users (name, email, password, description, role, avatar)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [user.name, user.email, hashedPass, user.description, user.role, user.avatar]);
        userIds.push({ id: result.lastID, email: user.email });
        console.log(`✅ Usuario ${user.email} creado (ID: ${result.lastID})`);
      }

      // Mapa email -> id
      const emailToId = {};
      for (const u of userIds) {
        emailToId[u.email] = u.id;
      }

      // --- Insertar información personal (datos colombianos) ---
      console.log('Insertando información personal...');
      for (const data of personalData) {
        const userId = emailToId[data.user_email];
        if (userId) {
          await db.run(`
            INSERT INTO personal_info (user_id, phone, address, birth_date, dni)
            VALUES (?, ?, ?, ?, ?)
          `, [userId, data.phone, data.address, data.birth_date, data.dni]);
        } else {
          console.warn(`No se encontró usuario para email: ${data.user_email}`);
        }
      }
      console.log(`✅ ${personalData.length} registros de información personal insertados`);

      // --- Insertar tarjetas de crédito ---
      console.log('Insertando tarjetas de crédito...');
      for (const card of creditCards) {
        const userId = emailToId[card.user_email];
        if (userId) {
          await db.run(`
            INSERT INTO credit_cards (user_id, card_number, card_holder, expiration_date, cvv, type)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [userId, card.card_number, card.holder, card.exp, card.cvv, card.type]);
        } else {
          console.warn(`No se encontró usuario para email: ${card.user_email}`);
        }
      }
      console.log(`✅ ${creditCards.length} tarjetas de crédito insertadas`);

      // --- Insertar productos ---
      for (const product of sampleProducts) {
        await db.run(`
          INSERT INTO products (name, price, category, subcategory, image, description, stock)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          product.name,
          product.price,
          product.category,
          product.subcategory,
          product.image,
          product.description,
          product.stock
        ]);
      }
      console.log(`✅ ${sampleProducts.length} productos cargados`);

      // --- Insertar categorías ---
      for (const category of categories) {
        await db.run(`
          INSERT OR IGNORE INTO categories (name)
          VALUES (?)
        `, [category]);
      }
      console.log(`✅ ${categories.length} categorías cargadas`);

      // --- Insertar órdenes de compra ---
      const products = await db.all('SELECT id, name FROM products');
      const productMap = {};
      for (const p of products) {
        productMap[p.name] = p.id;
      }

      for (const order of orders) {
        const userId = emailToId[order.user_email];
        let realProductId = null;
        if (order.product_id === 1) realProductId = productMap["Cemento Gris 42.5 kg"];
        if (order.product_id === 2) realProductId = productMap["Ladrillo Hueco 12x18x33"];
        if (order.product_id === 3) realProductId = productMap["Hierro del 12 mm x 12 m"];
        if (order.product_id === 4) realProductId = productMap["Arena Fina x m3"];
        if (order.product_id === 5) realProductId = productMap["Madera Pino x 3m"];
        if (realProductId && userId) {
          await db.run(`
            INSERT INTO orders (user_id, product_id, quantity, total, status, order_date)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [userId, realProductId, order.quantity, order.total, order.status, order.order_date]);
        }
      }
      console.log(`✅ ${orders.length} órdenes de compra insertadas`);

      console.log('\n🎉 Base de datos SQLite inicializada completamente con datos colombianos.');
      console.log('Credenciales de usuarios:');
      console.log(`   Admin: admin@elcimiento.com / ${initialUsers[0].password}`);
      for (const user of additionalUsers) {
        console.log(`   ${user.email} / ${user.password}`);
      }
    } else {
      console.log('ℹ️ La base de datos ya contiene datos. No se realizaron cambios.');
    }

  } catch (error) {
    console.error('Error en el seeding:', error);
  } finally {
    await closeDatabase();
  }
}

seedDatabase();