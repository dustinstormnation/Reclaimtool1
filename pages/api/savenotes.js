const saveNotesToCloud = async () => {
  const fileName = `notes/${Date.now()}.txt`;
  try {
    await fetch('/api/saveNotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, fileName })
    });
    setInfoMsg('Notes saved to cloud!');
    setTimeout(() => setInfoMsg(''), 2000);
  } catch (err) {
    setErrorMsg('Failed to save notes.');
  }
};
