namev = a

vue-c:
	cd ./client/src/components && \
	md $(namev) && \
	cd $(namev) && \
	echo > style.scss && \
	echo > media.scss
	copy templateVue.txt "./client/src/components/$(namev)/$(namev).vue "
	
