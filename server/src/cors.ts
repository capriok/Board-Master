export const corsOptions = (whitelist: string[]): { origin: any, credentials: Boolean } => {
	return {
		origin: (origin: string, callback: (arg0: Error | null, arg1?: Boolean) => any) => {
			if (whitelist.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		},
		credentials: true
	}
}

export const corsMiddleware = (req, res, next) => {
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
		return res.status(200).json({});
	}
	next();
}