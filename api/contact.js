import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 1. Pastikan hanya metode POST yang diizinkan
    if (req.method.toUpperCase() !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed, please use POST' });
    }

    // 2. Inisialisasi Supabase di dalam handler
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // Cek apakah variabel lingkungan tersedia
    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase Environment Variables");
        return res.status(500).json({ message: 'Server configuration error: Missing API Keys' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { name, email, message } = req.body;

        // 3. Validasi input
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields (name, email, message) are required' });
        }

        // 4. Masukkan data ke tabel 'contacts'
        const { error } = await supabase
            .from('contacts')
            .insert([{ 
                name: name, 
                email: email, 
                message: message 
            }]);

        // Jika terjadi error pada database Supabase
        if (error) {
            console.error("Supabase Insert Error:", error.message);
            throw error;
        }

        // 5. Kirim respon sukses
        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        // Menangkap error tak terduga
        console.error("API Handler Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}