const bcrypt = require('bcryptjs');

// Test the password hash
const testPassword = async () => {
    const password = 'Admin@123';
    const storedHash = '$2a$10$6JYp8WqGv5FQwH8t9s0Z/OVbM3N4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q';

    console.log('Testing password:', password);
    console.log('Stored hash:', storedHash);

    const isMatch = await bcrypt.compare(password, storedHash);
    console.log('Password matches?', isMatch);

    // Generate new hash if needed
    if (!isMatch) {
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, salt);
        console.log('New hash:', newHash);
    }
};

testPassword();