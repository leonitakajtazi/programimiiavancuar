const express = require('express');
const app = express();
const port = 3000;

// Përdor middleware për të parsuar JSON body në kërkesa
app.use(express.json());

// Importo librarinë e Supabase
const { createClient } = require('@supabase/supabase-js');

// Konfigurimi i lidhjes me Supabase (përdor kredencialet e tua)
const supabaseUrl = 'https://utmlvyxtgnozphpiunfy.supabase.co'; // URL e projektit tënd Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bWx2eXh0Z25venBocGl1bmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTAxNjUsImV4cCI6MjA1OTU4NjE2NX0.q9me0DEC9y9pYlxfsXz1AnHMhU4QcAbKVW-OgklDSV4'; // Çelësi publik (anon) i projektit tënd
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Endpoint-et e API-t të integruara me Supabase ---

// GET /api/products - Merr të gjitha produktet nga Supabase
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products') // Zëvendëso 'products' me emrin e saktë të tabelës tënde në Supabase
      .select('*'); // Merr të gjitha kolonat

    if (error) {
      // Nëse ka gabim nga Supabase, kthe error 500
      console.error('Supabase error (GET all):', error);
      return res.status(500).json({ message: 'Gabim gjatë marrjes së produkteve nga databaza', error: error.message });
    }

    // Kthe të dhënat e marra nga Supabase
    res.json(data);

  } catch (err) {
    // Nëse ka gabim të papritur në server
    console.error('Server error (GET all):', err);
    res.status(500).json({ message: 'Gabim i papritur në server', error: err.message });
  }
});

// GET /api/products/:id - Merr një produkt specifik nga Supabase me ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id); // Merr ID nga parametrat e URL-së

    // Kontrollo nëse ID është numër i vlefshëm
    if (isNaN(productId)) {
        return res.status(400).json({ message: 'ID e produktit duhet të jetë numër' });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId) // Filtro sipas kolonës 'id'
      .single(); // Kthen një objekt të vetëm ose null (dhe error nëse gjenden më shumë se 1)

    if (error) {
      // Trajto gabimin specifik "Not Found" (PGRST116) nga .single()
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      // Për gabime të tjera Supabase
      console.error(`Supabase error (GET /${productId}):`, error);
      return res.status(500).json({ message: 'Gabim gjatë marrjes së produktit nga databaza', error: error.message });
    }

    // Nëse 'data' është null (edhe pse .single() duhet ta trajtonte me error PGRST116), kthe 404
    if (!data) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
    }

    // Kthe produktin e gjetur
    res.json(data);

  } catch (err) {
    console.error('Server error (GET /:id):', err);
    res.status(500).json({ message: 'Gabim i papritur në server', error: err.message });
  }
});

// POST /api/products - Shton një produkt të ri në Supabase
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Validim bazik i inputit
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Emri (name) dhe Çmimi (price) janë të detyrueshëm' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Çmimi (price) duhet të jetë numër pozitiv' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: name,
          price: price,
          description: description || null // Vendos null nëse description nuk jepet
        }
      ])
      .select() // Kthen rreshtin/rreshtat e shtuar
      .single(); // Presim vetëm një rresht të shtuar

    if (error) {
      console.error('Supabase error (POST):', error);
      return res.status(500).json({ message: 'Gabim gjatë shtimit të produktit në databazë', error: error.message });
    }

    // Kthe produktin e ri të krijuar me status 201 (Created)
    res.status(201).json(data);

  } catch (err) {
    console.error('Server error (POST):', err);
    res.status(500).json({ message: 'Gabim i papritur në server', error: err.message });
  }
});

// PUT /api/products/:id - Përditëson një produkt ekzistues në Supabase
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, price, description } = req.body;

    if (isNaN(productId)) {
        return res.status(400).json({ message: 'ID e produktit duhet të jetë numër' });
    }

    // Validim bazik - të paktën një fushë duhet të jepet për përditësim
    if (name === undefined && price === undefined && description === undefined) {
        return res.status(400).json({ message: 'Duhet të specifikoni të paktën një fushë për të përditësuar (name, price, description)' });
    }
    // Validim shtesë për tipin e të dhënave nëse jepen
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Nëse jepet, Çmimi (price) duhet të jetë numër pozitiv' });
    }

    // Ndërto objektin me të dhënat për përditësim (vetëm fushat që janë dhënë)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('products')
      .update(updateData) // Përditëso vetëm fushat e dhëna
      .eq('id', productId)
      .select() // Kthe rreshtin/rreshtat e përditësuar
      .single(); // Presim vetëm një rresht të përditësuar

    if (error) {
       // Trajto gabimin specifik "Not Found" (PGRST116) nga .single() në rast se update nuk gjeti rreshtin
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Produkti nuk u gjet për përditësim' });
      }
      console.error(`Supabase error (PUT /${productId}):`, error);
      return res.status(500).json({ message: 'Gabim gjatë përditësimit të produktit në databazë', error: error.message });
    }

    // Kthe produktin e përditësuar
    res.json(data);

  } catch (err) {
    console.error('Server error (PUT /:id):', err);
    res.status(500).json({ message: 'Gabim i papritur në server', error: err.message });
  }
});

// DELETE /api/products/:id - Fshin një produkt nga Supabase
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
        return res.status(400).json({ message: 'ID e produktit duhet të jetë numër' });
    }

    // Opsionale: Mund të kontrollosh nëse produkti ekziston para se ta fshish
    // por .delete() në Supabase nuk kthen error nëse nuk gjen rreshtin për të fshirë (thjesht nuk bën gjë).
    // Megjithatë, është praktikë e mirë REST të kthesh 404 nëse ID nuk ekziston.
    // Le të përdorim metodën `delete` dhe të shohim nëse kthen ndonjë të dhënë ose count.
    // Update: Metoda delete kthen { data, error, count }. `count` tregon sa rreshta u fshinë.

    const { data, error, count } = await supabase
      .from('products')
      .delete()
      .eq('id', productId); // Fshij rreshtin me këtë ID

    if (error) {
      console.error(`Supabase error (DELETE /${productId}):`, error);
      return res.status(500).json({ message: 'Gabim gjatë fshirjes së produktit nga databaza', error: error.message });
    }

    // Kontrollo nëse ndonjë rresht u fshi (count varet nga versioni i Supabase client, por zakonisht funksionon)
    // Nëse `count` nuk është i disponueshëm ose 0, do të thotë se produkti nuk u gjet.
    if (count === 0 || count === null) { // count mund të jetë null nëse RLS e ndalon ose nuk u gjet asgjë
         return res.status(404).json({ message: 'Produkti nuk u gjet për t\'u fshirë' });
    }


    // Kthe status 204 (No Content) për të treguar sukses në fshirje
    res.status(204).send();

  } catch (err) {
    console.error('Server error (DELETE /:id):', err);
    res.status(500).json({ message: 'Gabim i papritur në server', error: err.message });
  }
});

// Starto serverin
app.listen(port, () => {
  console.log(`🚀 Serveri po dëgjon në http://localhost:${port}`);
  console.log(`🔗 Endpoint-et e API-t: http://localhost:${port}/api/products`);
});