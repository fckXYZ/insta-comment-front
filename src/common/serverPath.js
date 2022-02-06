export const serverPath = {
	methods: {
		getServerPath: () => {
			if (process.env.NODE_ENV === 'development'){
				return 'http://localhost:3000'
			} else{
				return window.location.origin
			}
		}
	}
}
