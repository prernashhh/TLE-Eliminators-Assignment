// Find the route that handles GET /api/students/:id

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.status(200).json({ data: student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: error.message });
  }
});