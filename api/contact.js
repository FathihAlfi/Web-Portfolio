// api/contact.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Mengambil kredensial dari Environment Variables Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { name, email, message } = req.body;

        // Validasi sederhana
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Insert data ke tabel 'contacts'
        const { error } = await supabase
            .from('contacts')
            .insert([{ name, email, message }]);

        if (error) throw error;

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}