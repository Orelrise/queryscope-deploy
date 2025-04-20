# QueryScope

QueryScope is an SEO analysis tool that segments clicks between brand and non-brand queries using Google Search Console data.

## Features

- GSC service account JSON key import
- Date range selection (max 16 months)
- Brand detection regex pattern
- Results visualization with table and chart
- CSV export

## Prerequisites

- Python 3.10+
- Node.js 18+
- Google Search Console account with API access
- GSC service account JSON key

## Installation

### Backend

1. Create Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start server:
```bash
uvicorn main:app --reload
```

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start dev server:
```bash
npm run dev
```

## Usage

1. Access app at http://localhost:3000
2. Upload GSC service account JSON key
3. Select date range
4. Define brand detection regex
5. Click "Analyze" for results
6. Download CSV if needed

## Security

- JSON key processed in RAM only
- No data storage
- HTTPS required in production

## Limitations

- Analysis based on GSC API sample
- Single property only
- No history or comparative dashboard

## Contributing

Contributions welcome! Open an issue or submit a PR.

## License

MIT 