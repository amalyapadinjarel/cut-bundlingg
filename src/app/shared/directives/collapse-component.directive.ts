import { Directive, Input, ElementRef, Renderer2, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';


@Directive({
	selector: '[collapsibleComponent]',
})
export class CollapsibleComponentDirective {

	collapseBtn: any;
	@Input() collapsed = false;
	@Input() direction = "left";

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
		private renderer: Renderer2,
		private elementRef: ElementRef
	) {
		this.loadComponent();
	}

	loadComponent() {
		if (this.direction) {
			this.elementRef.nativeElement.classList.add('collapsible');
			this.elementRef.nativeElement.classList.add('to-' + this.direction);
			this.viewContainerRef.clear();
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MatIcon);
			const matIcon = this.viewContainerRef.createComponent(componentFactory, 2);
			this.collapseBtn = matIcon.injector.get(MatIcon)._elementRef.nativeElement;
			this.collapseBtn.innerHTML = 'keyboard_arrow_' + this.direction;
			this.collapseBtn.classList.add('collapse-btn');
			this.collapseBtn.addEventListener('click', () => {
				this.toggle();
			});
			this.renderer.appendChild(this.elementRef.nativeElement, this.collapseBtn);
			if (this.collapsed) {
				this.toggle();
			}
		}

	}

	private toggle() {
		if (!this.collapsed) {
			this.elementRef.nativeElement.classList.add('collapsed');
			this.collapseBtn.innerHTML = 'keyboard_arrow_' + this.getToggledDirection();
			this.collapsed = !this.collapsed;
		}
		else {
			this.elementRef.nativeElement.classList.remove('collapsed');
			this.collapseBtn.innerHTML = 'keyboard_arrow_' + this.direction;
			this.collapsed = !this.collapsed;
		}
	}

	private getToggledDirection() {
		if (this.direction == 'left') {
			return "right";
		}
		else if (this.direction == 'right') {
			return "left";
		}
	}

}
